'use strict';

const { InteractionWebhook } = require('discord.js');
const Interaction = require('./Interaction');
const InteractionResponses = require('./interfaces/InteractionResponses');
const BaseMessageComponent = require('../structures/BaseMessageComponent');
const ModalActionRow = require('../structures/ModalActionRow');
const ModalSubmitField = require('../structures/ModalSubmitField');
const { InteractionTypes } = require('../util/Constants');

/**
 * Represents a Modal Submit Interaction.
 * @extends Interaction
 */

class ModalSubmitInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The type of the Interaction.
     * @type {String}
     */

    this.type = InteractionTypes[data.type] ?? null;

    /**
     * The Custom Id of the Modal.
     * @type {String}
     */

    this.customId = data.data.custom_id;

    /**
     * The Message of the Modal Submit Interaction.
     * @type {Message}
     */

    this.message = data.message ? this.channel?.messages._add(data.message) ?? data.message : null;

    const modalFields = [];
    for (let i = 0; i < data.data.components.length; i++) {
      const field = data.data.components[i].components[0];
      modalFields.push(field);
    }

    /**
     * The (Fields) Text Input Components of the Modal.
     * @type {ModalSubmitField}
     */

    this.fields =
      modalFields.map(f => new ModalSubmitField(f)) ??
      data.data.components?.map(c => BaseMessageComponent.create(c, this.client)) ??
      [];

    /**
     * The Action Rows of the modal with the Text Input Components.
     */

    this.components = data.data.components?.map(component => new ModalActionRow(component));

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */

    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
  }

  /**
   * Gets a Text Input Component value.
   * @param {string} customId The Custom Id of a Text Input Component.
   * @returns {string} The Value of a Text Input Component.
   */

  getTextInputValue(customId) {
    const fieldFound = this.fields.find(f => f.customId === customId);

    return fieldFound ? fieldFound.value : null;
  }

  /**
   * Gets a Modal Submit Field.
   * @param {string} customId The Custom Id of a Text Input Component.
   * @returns {ModalSubmitField} Field of a Modal Submit Interaction.
   */

  getField(customId) {
    const fieldToGet = this.fields.find(f => f.customId === customId);

    return fieldToGet ? fieldToGet : null;
  }

  isFromMessage() {
    return Boolean(this.message);
  }

  deferReply() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
  update() {}
}

InteractionResponses.applyToClass(ModalSubmitInteraction, ['deferUpdate', 'showModal']);

module.exports = ModalSubmitInteraction;
