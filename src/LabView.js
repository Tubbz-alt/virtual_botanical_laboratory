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
import {Lab} from "./Lab.js";
import LABVIEW_TEMPLATE from "./labview/template.js";

const _lab = new WeakMap();
const _parentElement = new WeakMap();
const _config = new WeakMap();

const createView = function (labview, parentElementOrSelector) {
    const template = document.createElement("div");
    template.classList.add("lab-view");
    template.innerHTML = LABVIEW_TEMPLATE;

    let elt;
    if (parentElementOrSelector instanceof Node) {
        elt = parentElementOrSelector;
    } else {
        elt = document.querySelector(parentElementOrSelector);
    }
    elt.append(template);
    return elt;
}

const viewElt = function (labview) {
};

const lsystemView = function (labview) {
};

const interpretationView = function (labview) {
};

const helpView = function (labview) {
};

const aboutView = function (labview) {
};



/**
 * A user interface for a Lab.
 *
 * @property {Lab} lab
 */
class LabView {

    /**
     * Create a new LabView.
     *
     * @param {HTMLElement|String} parentElementOrSelector - the parent
     * element, or a selector to the parent element, to which this LabView
     * will be appended.
     * @param {Object} [config = {}] - the initial configuration of this
     * LabView.
     */
    constructor(parentElementOrSelector, config = {}) {
        // TODO: It is probably a good idea to validate the config first, though.
        _config.set(this, Object.create(null, {}));
        Object.assign(_config.get(this), config);


        _parentElement.set(this, createView(this, parentElementOrSelector));
    }

    get lab() {
        return _lab.get(this);
    }

    set lab(newLab) {
        _lab.set(this, newLab);
    }

    // Control the lab view

    set(sectionName, key, value) {
        let section = _config.get(this)[sectionName];
        if (undefined === section) {
            section = Object.create(null);
            _config.get(this)[sectionName] = section;
        }
        section[key] = value;
    }

    get(sectionName, key) {
        const section = _config.get(this)[sectionName];
        return undefined === section ? section[key] : undefined;
    }

    // File and export actions

    create() {
    }

    save() {
    }

    open() {
    }

    exportToPNG() {
    }

    // Control a lab actions

    run() {
        const steps = this.config.steps || 1;
        this.lab.run(steps);
    }

    step() {
        this.lab.run(1);
    }

    pause() {
        this.lab.stop();
    }

    reset() {
        this.lab.reset();
    }

}

export {
    LabView
}