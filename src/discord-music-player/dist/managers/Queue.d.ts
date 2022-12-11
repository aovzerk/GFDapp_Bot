import { Guild, GuildChannelResolvable } from "discord.js";
import { StreamConnection } from "../voice/StreamConnection";
import { Player, PlayerOptions, Playlist, PlaylistOptions, PlayOptions, ProgressBar, ProgressBarOptions, RepeatMode, Song } from "..";
export declare class Queue<T = unknown> {
    player: Player;
    guild: Guild;
    connection: StreamConnection | undefined;
    songs: Song[];
    isPlaying: boolean;
    data?: T;
    options: PlayerOptions;
    repeatMode: RepeatMode;
    destroyed: boolean;
    /**
     * Queue constructor
     * @param {Player} player
     * @param {Guild} guild
     * @param {PlayerOptions} options
     */
    constructor(player: Player, guild: Guild, options?: PlayerOptions);
    /**
     * Gets the current volume
     * @type {number}
     */
    get volume(): number;
    /**
     * Gets the paused state of the player
     * @type {boolean}
     */
    get paused(): boolean;
    /**
     * Returns current playing song
     * @type {?Song}
     */
    get nowPlaying(): Song | undefined;
    /**
     * Joins a voice channel
     * @param {GuildChannelResolvable} channelId
     * @returns {Promise<Queue>}
     */
    join(channelId: GuildChannelResolvable): Promise<this>;
    /**
     * Plays or Queues a song (in a VoiceChannel)
     * @param {Song | string} search
     * @param {PlayOptions} [options=DefaultPlayOptions]
     * @returns {Promise<Song>}
     */
    play(search: Song | string, options?: PlayOptions & {
        immediate?: boolean;
        seek?: number;
        data?: T;
    }): Promise<Song>;
    /**
     * Plays or Queues a playlist (in a VoiceChannel)
     * @param {Playlist | string} search
     * @param {PlaylistOptions} [options=DefaultPlaylistOptions]
     * @returns {Promise<Playlist>}
     */
    playlist(search: Playlist | string, options?: PlaylistOptions & {
        data?: T;
    }): Promise<Playlist>;
    /**
     * Seeks the current playing Song
     * @param {number} time
     * @returns {boolean}
     */
    seek(time: number): Promise<true | Song>;
    /**
     * Skips the current playing Song and returns it
     * @param {number} [index=0]
     * @returns {Song}
     */
    skip(index?: number): Song;
    /**
     * Stops playing the Music and cleans the Queue
     * @returns {void}
     */
    stop(): void;
    /**
     * Shuffles the Queue
     * @returns {Song[]}
     */
    shuffle(): Song[] | undefined;
    /**
     * Pause/resume the current Song
     * @param {boolean} [state=true] Pause state, if none it will pause the Song
     * @returns {boolean}
     */
    setPaused(state?: boolean): boolean | undefined;
    /**
     * Remove a Song from the Queue
     * @param {number} index
     * @returns {Song|undefined}
     */
    remove(index: number): Song | undefined;
    /**
     * Sets the current volume
     * @param {number} volume
     * @returns {boolean}
     */
    setVolume(volume: number): boolean;
    /**
     * Clears the Queue
     * @returns {void}
     */
    clearQueue(): void;
    /**
     * Sets Queue repeat mode
     * @param {RepeatMode} repeatMode
     * @returns {boolean}
     */
    setRepeatMode(repeatMode: RepeatMode): boolean;
    /**
     * Creates Progress Bar class
     * @param {ProgressBarOptions} [options]
     * @returns {ProgressBar}
     */
    createProgressBar(options?: ProgressBarOptions): ProgressBar;
    /**
     * Set's custom queue data
     * @param {any} data
     * @returns {void}
     */
    setData(data: T): void;
    /**
     * Disconnects the player
     * @returns {void}
     */
    leave(): void;
}
