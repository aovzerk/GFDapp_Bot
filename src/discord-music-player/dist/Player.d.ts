import { Client, Collection, Snowflake, VoiceState } from "discord.js";
import EventEmitter from "events";
import { Queue } from "./managers/Queue";
import { PlayerEvents, PlayerOptions } from "./types/types";
export declare class Player<OptionsData = any> extends EventEmitter {
    client: Client;
    queues: Collection<Snowflake, Queue<OptionsData>>;
    options: PlayerOptions;
    /**
     * Player constructor
     * @param {Client} client
     * @param {PlayerOptions} [options={}]
     */
    constructor(client: Client, options?: PlayerOptions);
    /**
     * Creates the guild queue.
     * @param {Snowflake} guildId
     * @param {PlayerOptions} [options=this.options]
     * @returns {Queue}
     */
    createQueue<D extends OptionsData>(guildId: Snowflake, options?: PlayerOptions & {
        data?: D;
    }): Queue<D>;
    /**
     * Check if the guild has a queue.
     * @param {Snowflake} guildId
     * @returns {boolean}
     */
    hasQueue(guildId: Snowflake): boolean;
    /**
     * Gets the guild queue.
     * @param {Snowflake} guildId
     * @returns {?Queue}
     */
    getQueue(guildId: Snowflake): Queue | undefined;
    /**
     * Deletes the guild queue.
     * @param {Snowflake} guildId
     * @param {Queue} queue
     * @returns {void}
     */
    setQueue(guildId: Snowflake, queue: Queue<OptionsData>): void;
    /**
     * Deletes the guild queue.
     * @param {Snowflake} guildId
     * @returns {void}
     */
    deleteQueue(guildId: Snowflake): void;
    /**
     * Handle a Voice State Update
     * @private
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @returns {void}
     */
    _voiceUpdate(oldState: VoiceState, newState: VoiceState): void;
}
export declare interface Player<OptionsData = any> {
    on<K extends keyof PlayerEvents = any>(event: K, listener: (...args: PlayerEvents<OptionsData>[K]) => void): this;
}
