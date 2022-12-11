"use strict";
const __importDefault = (this && this.__importDefault) || function(mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { "value": true });
exports.Utils = void 0;
const __1 = require("..");
const isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
const ytsr_1 = __importDefault(require("ytsr"));
const spotify_url_info_1 = __importDefault(require("spotify-url-info"));
const apple_music_metadata_1 = require("apple-music-metadata");
const youtubei_1 = require("youtubei");
const discord_js_1 = require("discord.js");
let YouTube = new youtubei_1.Client();
const { getData, getPreview } = (0, spotify_url_info_1.default)(isomorphic_unfetch_1.default);
class Utils {
	/**
     *
     */
	constructor() {
	}
	/**
     * Get ID from YouTube link
     * @param {string} url
     * @returns {?string}
     */
	static parseVideo(url) {
		const match = url.match(this.regexList.YouTubeVideoID);
		return match ? match[7] : null;
	}
	/**
     * Get timecode from YouTube link
     * @param {string} url
     * @returns {?string}
     */
	static parseVideoTimecode(url) {
		const match = url.match(this.regexList.YouTubeVideo);
		return match ? match[10] : null;
	}
	/**
     * Get ID from Playlist link
     * @param {string} url
     * @returns {?string}
     */
	static parsePlaylist(url) {
		const match = url.match(this.regexList.YouTubePlaylistID);
		return match ? match[1] : null;
	}
	/**
     * Search for Songs
     * @param {string} Search
     * @param {PlayOptions} [SOptions=DefaultPlayOptions]
     * @param {Queue} Queue
     * @param {number} [Limit=1]
     * @return {Promise<Song[]>}
     */
	static async search(Search, SOptions = __1.DefaultPlayOptions, Queue, Limit = 1) {
		SOptions = { ...__1.DefaultPlayOptions, ...SOptions };
		let Filters;
		try {
			// Default Options - Type: Video
			const FiltersTypes = await ytsr_1.default.getFilters(Search);
			Filters = FiltersTypes.get("Type").get("Video");
			// Custom Options - Upload date: null
			if (SOptions?.uploadDate !== null)
				Filters = Array.from((await ytsr_1.default.getFilters(Filters.url))
					.get("Upload date"), ([name, value]) => ({ name, "url": value.url }))
					.find(o => o.name.toLowerCase().includes(SOptions?.uploadDate))
                    ?? Filters;
			// Custom Options - Duration: null
			if (SOptions?.duration !== null)
				Filters = Array.from((await ytsr_1.default.getFilters(Filters.url))
					.get("Duration"), ([name, value]) => ({ name, "url": value.url }))
					.find(o => o.name.toLowerCase().startsWith(SOptions?.duration))
                    ?? Filters;
			// Custom Options - Sort by: relevance
			if (SOptions?.sortBy !== null && SOptions?.sortBy !== "relevance")
				Filters = Array.from((await ytsr_1.default.getFilters(Filters.url))
					.get("Sort by"), ([name, value]) => ({ name, "url": value.url }))
					.find(o => o.name.toLowerCase().includes(SOptions?.sortBy))
                    ?? Filters;
			const Result = await (0, ytsr_1.default)(Filters.url, {
				"limit": Limit
			});
			const items = Result.items;

			const songs = items.map(item => {
				if (item?.type?.toLowerCase() !== "video")
					return null;
				if (item.badges && item.badges.includes("LIVE")) {
					item.isLive = true;
				}
				return new __1.Song({
					"name": item.title,
					"url": item.url,
					"duration": item.duration,
					"author": item.author.name,
					"isLive": item.isLive,
					"thumbnail": item.bestThumbnail.url
				}, Queue, SOptions.requestedBy);
			}).filter(I => I);
			return songs;
		} catch (e) {
			throw __1.DMPErrors.SEARCH_NULL;
		}
	}
	/**
     * Search for Song via link
     * @param {string} Search
     * @param {PlayOptions} SOptions
     * @param {Queue} Queue
     * @return {Promise<Song>}
     */
	static async link(Search, SOptions = __1.DefaultPlayOptions, Queue) {
		const SpotifyLink = this.regexList.Spotify.test(Search);
		const YouTubeLink = this.regexList.YouTubeVideo.test(Search);
		const AppleLink = this.regexList.Apple.test(Search);
		if (AppleLink) {
			try {
				const AppleResult = await (0, apple_music_metadata_1.getSong)(Search);
				if (AppleResult) {
					const SearchResult = await this.search(`${AppleResult.artist} - ${AppleResult.title}`, SOptions, Queue);
					return SearchResult[0];
				}
			} catch (e) {
				throw __1.DMPErrors.INVALID_APPLE;
			}
		} else if (SpotifyLink) {
			try {
				const SpotifyResult = await getPreview(Search);
				const SearchResult = await this.search(`${SpotifyResult.artist} - ${SpotifyResult.title}`, SOptions, Queue);
				return SearchResult[0];
			} catch (e) {
				throw __1.DMPErrors.INVALID_SPOTIFY;
			}
		} else if (YouTubeLink) {
			const VideoID = this.parseVideo(Search);
			if (!VideoID)
				throw __1.DMPErrors.SEARCH_NULL;
			YouTube = new youtubei_1.Client({
				"requestOptions": {
					"localAddress": SOptions.localAddress
				}
			});
			const VideoResult = await YouTube.getVideo(VideoID);
			if (!VideoResult)
				throw __1.DMPErrors.SEARCH_NULL;
			const VideoTimecode = this.parseVideoTimecode(Search);
			return new __1.Song({
				"name": VideoResult.title,
				"url": Search,
				"duration": this.msToTime((VideoResult.duration ?? 0) * 1000),
				"author": VideoResult.channel.name,
				"isLive": VideoResult.isLiveContent,
				"thumbnail": VideoResult.thumbnails.best,
				"seekTime": SOptions.timecode && VideoTimecode ? Number(VideoTimecode) * 1000 : null
			}, Queue, SOptions.requestedBy);
		} else
			return null;
	}
	/**
     * Gets the best result of a Search
     * @param {Song|string} Search
     * @param {PlayOptions} SOptions
     * @param {Queue} Queue
     * @return {Promise<Song>}
     */
	static async best(Search, SOptions = __1.DefaultPlayOptions, Queue) {
		let _Song;
		if (Search instanceof __1.Song)
			return Search;
		_Song = await this.link(Search, SOptions, Queue).catch(error => {
			if (!(error instanceof TypeError)) {
				throw __1.DMPErrors.UNKNOWN; // Ignore typeError
			}
		});
		if (!_Song)
			_Song = (await this.search(Search, SOptions, Queue))[0];
		return _Song;
	}
	/**
     * Search for Playlist
     * @param {string} Search
     * @param {PlaylistOptions} SOptions
     * @param {Queue} Queue
     * @return {Promise<Playlist>}
     */
	static async playlist(Search, SOptions = __1.DefaultPlaylistOptions, Queue) {
		if (Search instanceof __1.Playlist)
			return Search;
		const Limit = SOptions.maxSongs ?? -1;
		const SpotifyPlaylistLink = this.regexList.SpotifyPlaylist.test(Search);
		const YouTubePlaylistLink = this.regexList.YouTubePlaylist.test(Search);
		const ApplePlaylistLink = this.regexList.ApplePlaylist.test(Search);
		if (ApplePlaylistLink) {
			const AppleResultData = await (0, apple_music_metadata_1.getPlaylist)(Search).catch(() => null);
			if (!AppleResultData)
				throw __1.DMPErrors.INVALID_PLAYLIST;
			const AppleResult = {
				"name": AppleResultData.name,
				"author": AppleResultData.author,
				"url": Search,
				"songs": [],
				"type": AppleResultData.type
			};
			AppleResult.songs = (await Promise.all(AppleResultData.tracks.map(async (track, index) => {
				if (Limit !== -1 && index >= Limit)
					return null;
				const Result = await this.search(`${track.artist} - ${track.title}`, SOptions, Queue).catch(() => null);
				if (Result && Result[0]) {
					Result[0].data = SOptions.data;
					return Result[0];
				} else
					return null;
			})))
				.filter((V) => V !== null);
			if (AppleResult.songs.length === 0)
				throw __1.DMPErrors.INVALID_PLAYLIST;
			if (SOptions.shuffle)
				AppleResult.songs = this.shuffle(AppleResult.songs);
			return new __1.Playlist(AppleResult, Queue, SOptions.requestedBy);
		} else if (SpotifyPlaylistLink) {
			const SpotifyResultData = await getData(Search).catch(() => null);
			if (!SpotifyResultData || !["playlist", "album"].includes(SpotifyResultData.type))
				throw __1.DMPErrors.INVALID_PLAYLIST;
			const SpotifyResult = {
				"name": SpotifyResultData.name,
				"author": SpotifyResultData.type === "playlist" ? SpotifyResultData.owner.display_name : SpotifyResultData.artists[0].name,
				"url": Search,
				"songs": [],
				"type": SpotifyResultData.type
			};
			SpotifyResult.songs = (await Promise.all((SpotifyResultData.tracks?.items ?? []).map(async (track, index) => {
				if (Limit !== -1 && index >= Limit)
					return null;
				if (SpotifyResult.type === "playlist")
					track = track.track;
				const Result = await this.search(`${track.artists[0].name} - ${track.name}`, SOptions, Queue).catch(() => null);
				if (Result && Result[0]) {
					Result[0].data = SOptions.data;
					return Result[0];
				} else
					return null;
			})))
				.filter((V) => V !== null);
			if (SpotifyResult.songs.length === 0)
				throw __1.DMPErrors.INVALID_PLAYLIST;
			if (SOptions.shuffle)
				SpotifyResult.songs = this.shuffle(SpotifyResult.songs);
			return new __1.Playlist(SpotifyResult, Queue, SOptions.requestedBy);
		} else if (YouTubePlaylistLink) {
			const PlaylistID = this.parsePlaylist(Search);
			if (!PlaylistID)
				throw __1.DMPErrors.INVALID_PLAYLIST;
			YouTube = new youtubei_1.Client({
				"requestOptions": {
					"localAddress": SOptions.localAddress
				}
			});
			const YouTubeResultData = await YouTube.getPlaylist(PlaylistID);
			if (!YouTubeResultData || Object.keys(YouTubeResultData).length === 0)
				throw __1.DMPErrors.INVALID_PLAYLIST;
			const YouTubeResult = {
				"name": YouTubeResultData.title,
				"author": YouTubeResultData instanceof youtubei_1.Playlist ? YouTubeResultData.channel?.name ?? "YouTube Mix" : "YouTube Mix",
				"url": Search,
				"songs": [],
				"type": "playlist"
			};
			if (YouTubeResultData instanceof youtubei_1.Playlist && YouTubeResultData.videoCount > 100 && (Limit === -1 || Limit > 100))
				await YouTubeResultData.next(Math.floor((Limit === -1 || Limit > YouTubeResultData.videoCount ? YouTubeResultData.videoCount : Limit - 1) / 100));
			YouTubeResult.songs = YouTubeResultData.videos.map((video, index) => {
				if (Limit !== -1 && index >= Limit)
					return null;
				const song = new __1.Song({
					"name": video.title,
					"url": `https://youtube.com/watch?v=${video.id}`,
					"duration": this.msToTime((video.duration ?? 0) * 1000),
					"author": video.channel.name,
					"isLive": video.isLive,
					"thumbnail": video.thumbnails.best
				}, Queue, SOptions.requestedBy);
				song.data = SOptions.data;
				return song;
			})
				.filter((V) => V !== null);
			if (YouTubeResult.songs.length === 0)
				throw __1.DMPErrors.INVALID_PLAYLIST;
			if (SOptions.shuffle)
				YouTubeResult.songs = this.shuffle(YouTubeResult.songs);
			return new __1.Playlist(YouTubeResult, Queue, SOptions.requestedBy);
		}
		throw __1.DMPErrors.INVALID_PLAYLIST;
	}
	/**
     * Shuffles an array
     * @param {any[]} array
     * @returns {any[]}
     */
	static shuffle(array) {
		if (!Array.isArray(array))
			return [];
		const clone = [...array];
		const shuffled = [];
		while (clone.length > 0)
			shuffled.push(clone.splice(Math.floor(Math.random() * clone.length), 1)[0]);
		return shuffled;
	}
	/**
     * Converts milliseconds to duration (HH:MM:SS)
     * @returns {string}
     */
	static msToTime(duration) {
		const seconds = Math.floor(duration / 1000 % 60);
		const minutes = Math.floor(duration / 60000 % 60);
		const hours = Math.floor(duration / 3600000);
		const secondsPad = `${seconds}`.padStart(2, "0");
		const minutesPad = `${minutes}`.padStart(2, "0");
		const hoursPad = `${hours}`.padStart(2, "0");
		return `${hours ? `${hoursPad}:` : ""}${minutesPad}:${secondsPad}`;
	}
	/**
     * Converts duration (HH:MM:SS) to milliseconds
     * @returns {number}
     */
	static timeToMs(duration) {
		return duration.split(":")
			.reduceRight((prev, curr, i, arr) => prev + parseInt(curr) * 60 ** (arr.length - 1 - i), 0) * 1000;
	}
	static isVoiceChannel(Channel) {
		const type = Channel.type;
		if (typeof type === "string")
			return ["GUILD_VOICE", "GUILD_STAGE_VOICE"].includes(type);
		else
			return [discord_js_1.ChannelType.GuildVoice, discord_js_1.ChannelType.GuildStageVoice].includes(type);
	}
	static isStageVoiceChannel(Channel) {
		const type = Channel.type;
		if (typeof type === "string")
			return type === "GUILD_STAGE_VOICE";
		else
			return type === discord_js_1.ChannelType.GuildStageVoice;
	}
}
exports.Utils = Utils;
Utils.regexList = {
	"YouTubeVideo": /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(((.*(\?|\&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/,
	"YouTubeVideoID": /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
	"YouTubePlaylist": /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
	"YouTubePlaylistID": /[&?]list=([^&]+)/,
	"Spotify": /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-)+)(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
	"SpotifyPlaylist": /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|playlist)\/|\?uri=spotify:playlist:)((\w|-)+)(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
	"Apple": /https?:\/\/music\.apple\.com\/.+?\/.+?\/(.+?)\//,
	"ApplePlaylist": /https?:\/\/music\.apple\.com\/.+?\/.+?\/(.+?)\//
};
