/*
 * Copyright 2017 Huub de Beer <huub@heerdebeer.org>
 *
 * This file is part of virtual_botanical_laboratory.
 *
 * virtual_botanical_laboratory is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * virtual_botanical_laboratory is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
 * Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with virtual_botanical_laboratory.  If not, see
 * <http://www.gnu.org/licenses/>.
 * 
 */
import {View} from "./View.js";
import {Command} from "../interpretation/Command.js";
import {PropertyEditor} from "./PropertyEditor.js";

const _propertyEditor = new WeakMap();
const _commandEditor = new WeakMap();

const createPropertyEditor = function(view, properties, definedProperties) {
    const propertyEditor = new PropertyEditor(properties, definedProperties, {
        header: "Properties",
        keyLabel: "Name",
        valueLabel: "Value",
        addLabel: "Add property"
    });

    _propertyEditor.set(view, propertyEditor);
    return propertyEditor;
};

const createCommandPropertyEditor = function(view, commands, definedCommands) {
    const commandEditor = new PropertyEditor(commands, definedCommands, {
        header: "Commands",
        keyLabel: "Name",
        valueLabel: "Definition",
        addLabel: "Add command definition",
        editable: false
    });

    _commandEditor.set(view, commandEditor);
    return commandEditor;
};


/**
 * The InterpretationView represents a form to inspect and configure the
 * properties of an Interpretation.
 *
 * @property {Object} properties - the properties of the interpretation to
 * configure
 * @property {Object} values - the values of the properties of the
 * interpretation to configure
 *
 */
class InterpretationView extends View {

    /**
     * Create a new InterpretationView
     *
     * @param {HTMLElement} elt
     * @param {Interpretation} interpretation
     * @param {Object} [interpretationConfig = {}]
     * @param {Object} [config = {}]
     */
    constructor(elt, interpretation, interpretationConfig = {}, config = {}) {
        super(elt, "interpretation", config);

        const container = document.createElement("div");
        container.classList.add("interpretation-contents");

        const properties = interpretation.registeredProperties;

        container.appendChild(createPropertyEditor(this, properties, interpretationConfig.config).element);
        
        const commands = Object.keys(interpretation.commands).map(command => {
            return {
                name: command,
                type: "textarea",
                default: "",
                converter: (s) => s
            };
        });
        
        const definedCommands = {};

        Object.keys(interpretation.commands).forEach(name => {
            const command = interpretation.commands[name];
            definedCommands[name] = command.toString();
        });

        if (undefined !== interpretationConfig.commands) {
            Object.keys(interpretationConfig.commands).forEach(name => {
                const command = new Command(interpretationConfig.commands[name]);
                definedCommands[name] = command.toString();
            });
        }

        container.appendChild(createCommandPropertyEditor(this, commands, definedCommands).element);
        this.element.appendChild(container);
    }

    get properties() {
        return _propertyEditor.get(this).propertyValues;
    }

    get commands() {
        return _commandEditor.get(this).propertyValues;
    }

    updateCommands(interpretation) {
        const commandEditor = _commandEditor.get(this);

        const commands = Object.keys(interpretation.commands).map(command => {
            return {
                name: command,
                type: "textarea",
                default: "",
                converter: (s) => s
            };
        });

        const definedCommands = {};
        
        Object.keys(interpretation.commands).forEach(name => {
            const command = interpretation.getCommand(name);
            definedCommands[name] = undefined === command ? "" : command.toString();
        });

        commandEditor.element.parentNode.replaceChild(
            createCommandPropertyEditor(this, commands, definedCommands).element,
            commandEditor.element
        );

    }
}

export {
    InterpretationView
};

