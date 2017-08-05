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
/**
 * An error during the lexical analysis phase while parsing an LSystem input
 * string.
 */
class LexicalError extends Error {
}

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
/**
 * A Error encountered while parsing a LSystem input string.
 */
class ParseError extends Error {
}

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

const stringifyModuleTree = function (tree) {
    const converted = [];
    for (const node of tree) {
        if (node instanceof ModuleTree) {
            converted.push("[");
            converted.push(stringifyModuleTree(node));
            converted.push("]");
        } else {
            converted.push(node.stringify());
        }
    }
    return converted.join(" ");
};

const flatten = function (moduleTree) {
    let modules = [];
    for (const item of moduleTree) {
        if (item instanceof ModuleTree) {
            modules = modules.concat(flatten(item));
        } else {
            modules.push(item);
        }
    }
    return modules;
};

/**
 * A ModuleTree.
 */
class ModuleTree extends Array {
    /**
     * Create a new ModuleTree instance with an initial list of nodes, if any.
     *
     * @param {Module|ModuleTree} [nodes = []] - an initial list of nodes for
     * this new ModuleTree
     */
    constructor(nodes = []) {
        super();
        for (const node of nodes) {
            this.push(node);
        }
    }

    /**
     * Iterator yielding each module in this ModuleTree, via a breadth first
     * strategy for sub ModuleTrees.
     *
     * @yield {Module}
     */
    * eachModule() {
        for (const module of flatten(this)) {
            yield module;
        }
    }

    /**
     * Create a String representation of this ModuleTree.
     *
     * @return {String}
     */
    stringify() {
        return stringifyModuleTree(this);
    }
}

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
/**
 * A successor in a production.
 *
 * @property {Module[]} a list of modules
 */
class Successor extends ModuleTree {
    /**
     * Apply parameters to this successor.
     *
     * @param {NumericalExpression[]} [parameters = []] - the parameters to
     * apply to this Successor.
     *
     * @returns {Successor} This Successor with parameters applied, if any.
     */
    apply(parameters = []) {
        return this;
    }
}

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
const _predecessor = new WeakMap();
const _successor = new WeakMap();
const _condition = new WeakMap();

/**
 * A Production is a rewriting rule from a predecessor to a successor.
 *
 * @property {Predecessor} predecessor
 * @property {BooleanExpression} [condition = undefined] - productions in a
 * parameterized LSystem can have a condition guarding a production.
 * @property {Successor} successor
 */
class Production {
    /**
     * Create a new Production instance based on the predecessor, an optional
     * condition and a successor.
     *
     * @param {Predecessor} predecessor
     * @param {Successor} successor
     * @param {BooleanExpression} [condition = undefined]
     */
    constructor(predecessor, successor, condition = undefined) {
        _predecessor.set(this, predecessor);
        _successor.set(this, successor);
        _condition.set(this, condition);
    }

    get predecessor() {
        return _predecessor.get(this);
    }

    get successor() {
        return _successor.get(this);
    }

    get condition() {
        return _condition.get(this);
    }

    /**
     * Is this production conditional?
     *
     * @return {Boolean} True if this production has a condition.
     */
    isConditional() {
        return undefined !== this.condition;
    }

    /**
     * Follow this productions
     *
     * @param {NumericalExpression[]} [parameters = []] - an optional list of
     * parameters to check the condition and to apply to the successor of this
     * production.
     *
     * @returns {Successor} The successor of this Production with parameters
     * applied.
     */
    follow(parameters = []) {
        return this.successor.apply(parameters);
    }

    /**
     * Create a String representation of this Production.
     *
     * @return {String}
     */
    stringify() {
        let str = this.predecessor.stringify();
        if (this.isConditional()) {
            str += `: ${this.condition.stringify()}`;
        }
        str += ` -> ${this.successor.stringify()}`;
        return str;
    }
}

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
const _module = new WeakMap();
const _leftContext = new WeakMap();
const _rightContext = new WeakMap();

/**
 * A Predecessor in a Production.
 *
 * @param {Module} module
 * @param {ModuleTree} [leftContext = undefined] - an optional left context
 * for context sensitive productions.
 * @param {ModuleTree} [rightContext = undefined] - an optional right context
 * for context sensitive productions.
 */
class Predecessor {
    /**
     * Create a new instance of Predecessor
     *
     * @param {Module} module - the module this predecessor is about.
     */
    constructor(module) {
        _module.set(this, module);
        _leftContext.set(this, undefined);
        _rightContext.set(this, undefined);
    }

    get module() {
        return _module.get(this);
    }

    set leftContext(context) {
        _leftContext.set(this, context);
    }

    get leftContext() {
        return _leftContext.get(this);
    }

    /**
     * Has this predecessor a left context?
     *
     * @returns {Boolean}
     */
    hasLeftContext() {
        return undefined !== this.leftContext;
    }

    set rightContext(context) {
        _rightContext.set(this, context);
    }

    get rightContext() {
        return _rightContext.get(this);
    }

    /**
     * Has this predecessor a right context?
     *
     * @returns {Boolean}
     */
    hasRightContext() {
        return undefined !== this.rightContext;
    }

    /**
     * Is this a context sensitive predecessor?
     *
     * @returns {Boolean} True if this predecessor has a left context, a right
     * context, or both contexts.
     */
    isContextSensitive() {
        return this.hasLeftContext() || this.hasRightContext();
    }

    /**
     * Is this a context free predecessor?
     *
     * @returns {Boolean} True if this precessor does not care about the
     * context.
     */
    isContextFree() {
        return !this.isContextSensitive();
    }

    /**
     * Does this predecessor match a given module?
     *
     * @param {Module} module - the module to match against this predecessor.
     * @param {ModuleTree} [leftContext = undefined] - an optional left
     * context to match.
     * @param {ModuleTree} [rightContext = undefined] - an optional right
     * context to match.
     * @returns {Boolean} True if the module matches agains this predecessor,
     * i.e, they are equal and the context matches.
     */
    matches(module, leftContext = undefined, rightContext = undefined) {
        return this.module.equals(module);
    }

    /**
     * Create a String representation of this Predecessor.
     *
     * @returns {String}
     */
    stringify() {
        let str = "";
        if (this.hasLeftContext()) {
            str += `${this.leftContext.stringify()} < `;
        }
        str += this.module.stringify();
        if (this.hasRightContext()) {
            str += ` > ${this.rightContext.stringify()}`;
        }
        return str;
    }

}

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
/**
 * An IdentityProduction is a Production that maps a Module to itself. This is
 * used in an LSystem for all Modules in an Alphabet that do not have a
 * Production of their own. This allows to use more succinct LSystem
 * definitions.
 */
class IdentityProduction extends Production {
    /**
     * Create a new IdentityProduction instance.
     *
     * @param {Module} module - the module for which to create the
     * IdentityProduction.
     */
    constructor(module) {
        super(new Predecessor(module), new Successor([module]));
    }
}

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
// Token's private members
const _name = new WeakMap();
const _lexeme = new WeakMap();
const _value = new WeakMap();
const _column$1 = new WeakMap();
const _line$1 = new WeakMap();
const _lexemeBegin$1 = new WeakMap();

/**
 * A token recognized during the lexical analysis of a LSystem input string
 * and used to parse that input string.
 *
 * @property {Symbol} name - this Token's type name, such as IDENTIFIER or
 * OPERATOR
 * @property {String} lexeme - this Token's lexeme
 * @property {String|Number|undefined} value - this Token's value as
 * recognized from the lexeme
 * @property {Number} line - the line number this Token was found at in the
 * input string
 * @property {Number} column - the column on the line this Token was found at
 * @property {Number} lexemeBegin - the index of the first character of this
 * Token's lexeme in the input string
 */
class Token {
    /**
     * Create a new Token.
     *
     * @param {Symbol} name - the name of the token type, such as IDENTIFIER or
     *   OPERATOR
     * @param {String} lexeme - the string that is recognized as this token
     * @param {String|Number|undefined} value - the value represented by the
     *   lexeme
     * @param {Number} line - the line in the input string this token was
     *   recognized
     * @param {Number} column - the column in the line in the input string this
     *   token was recognized
     * @param {Number} lexemeBegin - the index of the first character of the
     *   lexeme in the input string
     */
    constructor(name, lexeme, value, line, column, lexemeBegin) {
        _name.set(this, name);
        _lexeme.set(this, lexeme);
        _value.set(this, value);
        _line$1.set(this, line);
        _column$1.set(this, column);
        _lexemeBegin$1.set(this, lexemeBegin);
    }

    get name() {
        return _name.get(this);
    }
    
    get lexeme() {
        return _lexeme.get(this);
    }

    get value() {
        return _value.get(this);
    }

    get line() {
        return _line$1.get(this);
    }

    get column() {
        return _column$1.get(this);
    }

    get lexemeBegin() {
        return _lexemeBegin$1.get(this);
    }

    /**
     * Get the position of this Token in the input source in the format (line,
     * column).
     *
     * @returns {String}
     */
    position() {
        return `(${this.line}, ${this.column})`;
    }
}

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
// Token names

const NUMBER = Symbol('NUMBER');
const IDENTIFIER = Symbol('IDENTIFIER');
const BRACKET_OPEN = Symbol('BRACKET_OPEN');
const BRACKET_CLOSE = Symbol('BRACKET_CLOSE');
const OPERATOR = Symbol('OPERATOR');
const DELIMITER = Symbol('DELIMITER');
const KEYWORD = Symbol('KEYWORD');

// Private data and functions for lexer

const _input = new WeakMap();
const _lexemeBegin = new WeakMap();
const _forward = new WeakMap();
const _line = new WeakMap();
const _column = new WeakMap();

const _context = new WeakMap();

// Manipulate state of DFA

const reset = function (lexer, input) {
    _input.set(lexer, input);
    _lexemeBegin.set(lexer, 0);
    _forward.set(lexer, -1);
    _line.set(lexer, 0);
    _column.set(lexer, 0);
    _context.set(lexer, undefined);
};

const saveState = function (lexer) {
    return {
        lexemeBegin: _lexemeBegin.get(lexer),
        forward: _forward.get(lexer),
        line: _line.get(lexer),
        column: _column.get(lexer)
    };
};

const restoreState = function (lexer, state) {
    _lexemeBegin.set(lexer, state.lexemeBegin);
    _forward.set(lexer, state.forward);
    _line.set(lexer, state.line);
    _column.set(lexer, state.column);
};

const setContext = function (lexer, newContext = undefined) {
    _context.set(lexer, newContext);
};

const isContext = function (lexer, context) {
    return _context.get(lexer) === context;
};

const line = function (lexer) {
    return _line.get(lexer);
};

const column = function (lexer) {
    return _column.get(lexer);
};

const peek = function (lexer, distance = 1) {
    const forward = _forward.get(lexer);
    if (forward + distance < _input.get(lexer).length) {
        return _input.get(lexer)[forward + distance];
    }
};

const moveForward = function (lexer, skip = false) {
    const c = peek(lexer);
    if (c) {
        _forward.set(lexer, _forward.get(lexer) + 1);
        if ('\n' === c) {
            _line.set(lexer, line(lexer) + 1);
            _column.set(lexer, 0);
        } else {
            _column.set(lexer, column(lexer) + 1);
        }

        if (skip) {
            _lexemeBegin.set(lexer, _lexemeBegin.get(lexer) + 1);
        }
    }
};

const lexeme = function (lexer) {
    const start = _lexemeBegin.get(lexer);
    const end = _forward.get(lexer);
    return _input.get(lexer).slice(start, end + 1);
};

const recognize  = function (lexer, tokenName, value) {
    const token = new Token(
        tokenName, 
        lexeme(lexer), 
        value, 
        line(lexer), 
        column(lexer) - lexeme(lexer).length,
        _lexemeBegin.get(this)
    );

    _lexemeBegin.set(lexer, _forward.get(lexer) + 1);
    _forward.set(lexer, _forward.get(lexer));

    return token;
};

const position = function (lexer) {
    return `(${line(lexer)}, ${column(lexer) - (_forward.get(lexer) - _lexemeBegin.get(lexer))})`;
};

// Recognize patterns

const isWhitespace = function (c) {
    return [' ', '\t', '\n'].includes(c);
};

const isCommentStart = function (c) {
    return '#' === c;
};

const isDigit = function (c) {
    return '0' <= c && c <= '9';
};

const isLetter = function (c) {
    return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z');
};

const isKeyword = function (identifier) {
    return [
        'lsystem',
        'alphabet',
        'axiom',
        'productions',
        'ignore',
        'include',
        'and',
        'or',
        'not',
        'true',
        'false'
    ].includes(identifier);
};

const isIdentifierSymbol = function (c) {
    return [
        "+",
        "-",
        "/",
        "*",
        "&",
        "|",
        "$"
    ].includes(c);
};

// Recognize Tokens

const skipWhitespace = function (lexer) {
    while (isWhitespace(peek(lexer))) {
        moveForward(lexer, true);
    }
};

const skipComment = function (lexer) {
    if (isCommentStart(peek(lexer))) {
        while ('\n' !== peek(lexer)) {
            moveForward(lexer, true);
        }
    }
};

const digits = function (lexer) {
    while(isDigit(peek(lexer))) {
        moveForward(lexer);
    }
};

const integer = function (lexer) {
    if (isDigit(peek(lexer))) {
        moveForward(lexer);
        digits(lexer);
    }
};

const number = function (lexer) {
    if (isDigit(peek(lexer))) {
        integer(lexer);

        // Decimal part
        if ('.' === peek(lexer) && isDigit(peek(lexer, 2))) {
            moveForward(lexer);
            digits(lexer);
        }

        // Exponent part
        if (['e', 'E'].includes(peek(lexer))) {
            moveForward(lexer);

            if (['+', '-'].includes(peek(lexer))) {
                moveForward(lexer);
            }

            if (!isDigit(peek(lexer))) {
                throw new LexicalError(`Expected a numerical exponential part at ${position(lexer)}, got '${peek(lexer)}' instead.`);
            }

            digits(lexer);
        }

        try {
            const value = parseFloat(lexeme(lexer));
            return recognize(lexer, NUMBER, value);        
        } catch (e) {
            throw new LexicalError(`Unable to parse '${lexeme(lexer)}' as a number at ${position(lexer)}.`);
        }
    }
};

const identifier = function (lexer) {
    // Modules can have symbols such as '+' or '-' as name as well.
    if (isContext(lexer, MODULE_NAME) && isIdentifierSymbol(peek(lexer))) {
        moveForward(lexer);
        return recognize(lexer, IDENTIFIER, lexeme(lexer));
    }

    if (isLetter(peek(lexer))) {
        moveForward(lexer);
        while (isLetter(peek(lexer)) || isDigit(peek(lexer))) {
            moveForward(lexer);
        }

        const id = lexeme(lexer);

        return isKeyword(id) ? 
            recognize(lexer, KEYWORD, id) : 
            recognize(lexer, IDENTIFIER, id);
    }
};


const bracket = function (lexer) {
    const BRACKET_OPEN_CHARACTERS = ['(', '{', '['];
    const BRACKET_CLOSE_CHARACTERS = [')', '}', ']'];

    if (isContext(lexer, CONTEXT)) {
        BRACKET_OPEN_CHARACTERS.push("<");
        BRACKET_CLOSE_CHARACTERS.push(">");
    }

    const c = peek(lexer);
    if (BRACKET_OPEN_CHARACTERS.includes(c)) {
        moveForward(lexer);
        return recognize(lexer, BRACKET_OPEN, c);
    } else if (BRACKET_CLOSE_CHARACTERS.includes(c)) {
        moveForward(lexer);
        return recognize(lexer, BRACKET_CLOSE, c);
    }
};

const delimiter = function (lexer) {
    const c = peek(lexer);
    if ([',', ':'].includes(c)) {
        moveForward(lexer);
        return recognize(lexer, DELIMITER, c);
    }
};

const operator = function (lexer) {
    const c = peek(lexer);
    if (['-', '+', '*', '/', '^', '>', '<', '='].includes(c)) {
        if ('-' === c) {
            moveForward(lexer);
            if ('>' === peek(lexer)) {
                moveForward(lexer);
            }
        } else if ('<' === c) {
            moveForward(lexer);
            if ('=' === peek(lexer) || '>' === peek(lexer)) {
                moveForward(lexer);
            }
        } else if ('>' === c) {
            moveForward(lexer);
            if ('=' === peek(lexer)) {
                moveForward(lexer);
            }
        } else {
            moveForward(lexer);
        }

        return recognize(lexer, OPERATOR, lexeme(lexer));
    }
};


/**
 * A Lexer to analyse LSystem input strings lexically.
 */
class Lexer {

    /**
     * Create a new Lexer for an LSystem input string
     *
     * @param {String} [input = ''] - the input string the analyse.
     */
    constructor(input = '') {
        reset(this, input);
    }

    /**
     * Get the next token in the input. The token to regognize can depend on
     * the context.
     *
     * @param {Symbol} [context = undefined] - an optional context to control
     * the recognition process. For example, symbols like '+' and '-' are
     * operators in the context of an expression, but are identifiers in the
     * context of an alphabet.
     *
     * @returns {Token|undefined} the recognized token or undefined if no
     * token could be recognized.
     */
    getNextToken(context = undefined) {
        setContext(this, context);
        while (peek(this)) {
            do {
                skipWhitespace(this);
                skipComment(this);
            } while (
                isWhitespace(peek(this)) || isCommentStart(peek(this))
            )

            const token =
                identifier(this) ||
                number(this) ||
                bracket(this) ||
                delimiter(this) ||
                operator(this);

            if (token) {
                return token;
            }
        }
    }

    /**
     * Look a distance ahead in the input string, optionally take into account
     * the context.
     *
     * @param {Number} [distance = 1] - the distance to look ahead, defaults to
     * 1.
     * @param {Symbol} [context = undefined] - an optional context to control
     * the recognition process.
     *
     * @returns {Token|undefined} the token recognized at distance or
     * undefined if no token could be recognized at that distance.
     */
    lookAhead(distance = 1, context = undefined) {
        const state = saveState(this);
        let token = undefined;
        for (let i = 0; i < distance; i++) {
            token = this.getNextToken(context);
        }
        restoreState(this, state);
        return token;
    }

}

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
// A Module's private properties
const _name$1 = new WeakMap();
const _parameters = new WeakMap();

/**
 * A Module represents a symbol in a LSystem.
 *
 * @property {String} name - the name of the module.
 * @property {Object[]} parameters - the parameters of this module.
 */
class Module {

    /**
     * Create a new Module
     *
     * @param {String} name - the module's name
     * @param {Object[]} [parameters = []] - the module's parameters, if any
     */
    constructor(name, parameters = []) {
        _name$1.set(this, name);
        _parameters.set(this, parameters);
    }

    get name() {
        return _name$1.get(this);
    }

    get parameters() {
        return _parameters.get(this);
    }

    /**
     * Is this Module equal to another module?
     *
     * @param {Module} other - the other module to compare this module with
     * @return {Boolean} True if the names are the same as well as their
     * number of parameters.
     */
    equals(other) {
        // console.log(`${this.name} === ${other.name} and ${this.parameters.length} === ${other.parameters.length}`);
        return this.name === other.name && this.parameters.length === other.parameters.length;
    }

    /**
     * Is this Module parameterized?
     *
     * @returns {Boolean} true if it has parameters.
     */
    isParameterized() {
        return 0 < this.parameters.length;
    }

    /**
     * Create a String representation of this Module.
     *
     * @returns {String}
     */
    stringify() {
        if (this.isParameterized()) {
            return `${this.name}(${this.parameters.map((p) => p.stringify()).join(',')})`;
        } else {
            return this.name;
        }
    }
}

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
/**
 * A ModuleDefinition defines a module in an alphabet.
 */
class ModuleDefinition extends Module {

    /**
     * Does an actual module matches this Module's definition?
     *
     * @param {Module} actualModule - the actual module to check against this
     * Module definition
     * @returns {Boolean} True if the number of parameters is the same in
     * actual and definition.
     */
    matchesDefinition(actualModule) {
        return this.parameters.length === actualModule.parameters.length;
    }

    /**
     * Create a String representation of this Module.
     *
     * @returns {String}
     */
    stringify() {
        if (this.isParameterized()) {
            return `${this.name}(${this.parameters.join(',')})`;
        } else {
            return this.name;
        }
    }
}

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
const _moduleDefinitions = new WeakMap();

/**
 * The Alphabet of an LSystem. The modules in an Alphabet are unique.
 */
class Alphabet {

    /**
     * Create a new instance of Alphabet.
     *
     * @param {Module[]} modules - a list of modules. 
     */
    constructor(modules) {
        _moduleDefinitions.set(this, []);
        for (const module of modules) {
            this.add(module);
        }
    }

    /**
     * Add a module to this Alphabet. If it already contains this module, an
     * error is thrown.
     *
     * @param {Module} module - the module to add
     * @throws {Error}
     */
    add(module) {
        if (this.has(module)) {
            throw new Error(`This alphabet already has a module '${module.stringify()}'.`);
        }
        _moduleDefinitions.get(this).push(module);
    }

    /**
     * Does this Alphabet have this module?
     *
     * @param {Module} module
     * @returns {Boolean} True if this Alphabet contains this module.
     */
    has(module) {
       return undefined !== this.get(module);
    }

    /**
     * Get a module from this Alphabet.
     *
     * @param {Module} module
     * @returns {Module|undefined} the module
     */
    get(module) {
       const found = _moduleDefinitions
            .get(this)
            .filter(
                (m) => 
                    m.name === module.name && 
                    m.parameters.every((p) => p in module.parameters)
            );
        return 1 === found.length ? found[0] : undefined;
    }

    /**
     * Create a String representation of this Alphabet.
     *
     * @returns {String}
     */
    stringify() {
        return _moduleDefinitions.get(this).map((m) => m.stringify()).join(", ");
    }

}

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
const _successorList = new WeakMap();


const setupProbabilityMapping = function (production, successorList) {
    let lower = 0;
    for (const successor of successorList) {
        if (0 >= successor.probability || successor.probability > 1) {
            throw new Error('Probability should be between 0 and 1');
        }

        successor.lower = lower;
        successor.upper = successor.lower + successor.probability;
        lower = successor.upper;
    }

    if (1 !== successorList.reduce((sum, pair) => sum += pair.probability, 0)) {
        throw new Error('Total probability should be 1');
    }

    _successorList.set(production, successorList);
};

/**
 * A StochasticProduction is a production with multiple possible rewriting
 * rules, each with a probability indicating the chance it will be chosen to
 * be used. The sum of the probabilities should be 1.
 *
 * @property {Successor} a successor is randomly chosen given the probability
 * of the rewriting rules of this StochasticProduction.
 */
class StochasticProduction extends Production {
    /**
     * Create a new instance of StochasticProduction.
     *
     * @param {Predecessor} predecessor
     * @param {Object[]} successor - pairs of successors and their
     * probabilities
     * @param {Number} successor.probability - the probability of the successor
     * @param {Successor} successor.successor - the successor
     * @param {BooleanExpression} [condition = undefined] - an optional
     * condition for this StochasticProduction.
     */
    constructor(predecessor, successors, condition = undefined) {
        super(predecessor, undefined, condition);
        setupProbabilityMapping(this, successors);
    }

    get successor() {
        const random = Math.random();
        const succ =  _successorList
            .get(this)
            .filter(
                (successor) => successor.lower <= random && random < successor.upper
            )[0].successor;
        return succ;
    }
   
    /**
     * Create a String representation of this StochasticProduction.
     *
     * @returns {String}
     */ 
    stringify() {
        let str = this.predecessor.stringify();
        if (this.isConditional()) {
            str += `: ${this.condition.stringify()}`;
        }
        str += "{\n";
        str += _successorList
            .get(this)
            .map((successor) => `\t${successor.probability} -> ${successor.successor.stringify()}`)
            .join(",\n");
        str += "\n}";
        return str;
    }
}

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
const _formalParameters = new WeakMap();
const _expression = new WeakMap();
const _evaluator = new WeakMap();

/**
 * An Expression can be evaluated to yield a value.
 *
 * @property {String} expression - a textual representation of this expression
 */
class Expression {

    /**
     * Create a new instance of an Expression.
     *
     * @param {String[]} [formalParameters = []] - an optional list of formal
     * parameter names.
     * @param {Boolean|Number|undefined} [expression = undefined] - an optional expression
     * value, defaults to undefined.
     */
    constructor(formalParameters = [], expression = undefined) {
        _formalParameters.set(this, formalParameters);
        _expression.set(this, expression);
        _evaluator.set(this, new Function(...formalParameters, `return ${expression}`));
    }

    /**
     * Evaluate this Expression given an optional list of actual parameters.
     *
     * @param {Number[]|Boolean[]} [actualParameters = []] - an optional list
     * of actual parameters to apply to this Expression before evaluating the
     * Expression.
     *
     * @return {Number|Boolean|undefined} the result of the evaluating this
     * Expression.
     */
    evaluate(actualParameters = []) {
        return _evaluator.get(this).apply(undefined, actualParameters);
    }

    get expression() {
        return _expression.get(this);
    }

    /**
     * Create a String representation of this Expression.
     *
     * @returns {String}
     */
    stringify() {
        return this.expression;
    }
}

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
/**
 * A BooleanExpression
 */
class BooleanExpression extends Expression {
    /**
     * Create a new instance of a BooleanExpression.
     *
     * @param {String[]} [formalParameters = []] - an optional list of formal
     * parameter names.
     * @param {Boolean} [expression = true] - an optional default value for
     * this BooleanExpression.
     */
    constructor(formalParameters = [], expression = true) {
        super(formalParameters, expression);
    }

    /**
     * Create a String representation of this BooleanExpression.
     *
     * @returns {String}
     */
    stringify() {
        return super
            .stringify()
            .replace(/&&/g, " and ")
            .replace(/\|\|/g, " or ")
            .replace(/!/g, " not ");
    }
}

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
/**
 * A NumericalExpression, which yields a Number value when evaluated
 */
class NumericalExpression extends Expression {
    /**
     * Create a new NumericalExpression instance.
     *
     * @param {String[]} [formalParameter = []] - an optional list of formal
     * parameter names used in this NumericalExpression.
     * @param {Number} [expression = NaN] - an optional default value.
     */
    constructor(formalParameters = [], expression = NaN) {
        super(formalParameters, expression);
    }

    /**
     * Create a String representation of this NumericalExpression.
     *
     * @returns {String}
     */
    stringify() {
        return super
            .stringify()
            .replace(/\*\*/g, " ^ ");
    }

}

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
const _lexer = new WeakMap();
const _idTable = new WeakMap();

// Scopes
const MODULE = Symbol("MODULE");
// Contexts
const CONTEXT = Symbol("CONTEXT");
const MODULE_NAME = Symbol("MODULE_NAME");

const installIdentifier = function (parser, identifierToken, scope = MODULE) {
    const idTable = _idTable.get(parser);
    const name = identifierToken.value;
    if (!defined(parser, name, scope)) {
        idTable.push({name, scope});
    } else {
        throw new ParseError(`'name' at ${identifierToken.position()} is already defined.`);
    }
};

const defined = function (parser, name, scope = MODULE) {
    const idTable = _idTable.get(parser);
    return idTable.find((id) => id.name === name && id.scope === scope);
};

const lookAhead = function (parser, name, value = undefined, distance = 1, context = undefined) {
    const token = _lexer.get(parser).lookAhead(distance, context);
    return token.name === name && (undefined !== value ? token.value === value : true);
};

const match = function (parser, name, value = undefined, context = undefined) {
    const token = _lexer.get(parser).getNextToken(context);
    if (token.name === name && (undefined !== value ? token.value === value : true)) {
        return token;
    } else {
        throw new ParseError(`expected ${name.toString()}${undefined !== value ? " with value '" + value + "'": ''} at ${token.position()}`);
    }
};

const parseList = function (parser, recognizeFunction, closingBracket = ")") {
    if (lookAhead(parser, BRACKET_CLOSE, closingBracket)) {
        return [];
    } else {
        const item = recognizeFunction.call(undefined, parser);
        const list = [item];
        if (lookAhead(parser, DELIMITER, ",")) {
            match(parser, DELIMITER, ",");
            return list.concat(parseList(parser, recognizeFunction));
        } else {
            return list;
        }
    }
};

const parseFormalParameter = function (parser) {
    return match(parser, IDENTIFIER).value;
};

const parseModuleDefinition = function (parser) {
    const moduleNameToken = match(parser, IDENTIFIER, undefined, MODULE_NAME);
    const moduleName = moduleNameToken.value;
    installIdentifier(parser, moduleNameToken, MODULE);

    let formalParameters = [];

    if (lookAhead(parser, BRACKET_OPEN, "(")) {
        match(parser, BRACKET_OPEN, "(");
        if (lookAhead(parser, IDENTIFIER)) {
            formalParameters = parseList(parser, parseFormalParameter);
        }
        match(parser, BRACKET_CLOSE, ")");
    }

    return new ModuleDefinition(moduleName, formalParameters);
};

const parseAlphabet = function (parser) {
    match(parser, KEYWORD, "alphabet");
    match(parser, DELIMITER, ":");
    match(parser, BRACKET_OPEN, "{");
    const alphabet = new Alphabet(parseList(parser, parseModuleDefinition, "}"));
    match(parser, BRACKET_CLOSE, "}");
    return alphabet;
};

const parseNumExprUnit = function (parser) {
    let numExpr = "";
    let variables = [];
    if (lookAhead(parser, IDENTIFIER)) {
        const variable = match(parser, IDENTIFIER).value;
        numExpr = variable;
        variables = [variable];
    } else if (lookAhead(parser, NUMBER)) {
        numExpr = match(parser, NUMBER).value.toString();
    } else if (lookAhead(parser, OPERATOR, "-")) {
        match(parser, OPERATOR, "-");
        const [expr, vars] = parseNumExprUnit(parser);
        numExpr = `- ${expr}`;
        variables = variables.concat(vars);
    } else if (lookAhead(parser, BRACKET_OPEN, "(")) {
        match(parser, BRACKET_OPEN, "(");
        const [expr, vars] = parseNumExpr(parser);
        numExpr = `(${expr})`;
        variables = variables.concat(vars);
    }
    return [numExpr, variables];
};

const parseNumFactor = function (parser) {
    let [expr, vars] = parseNumExprUnit(parser);
    if (lookAhead(parser, OPERATOR, "^")) {
        match(parser, OPERATOR);
        const [subExpr, subVars] = parseNumFactor(parser);
        expr += ` ** ${subExpr}`;
        vars = vars.concat(subVars);
    }
    return [expr, vars];
};

const parseNumTerm = function (parser) {
    let [expr, vars] = parseNumFactor(parser);
    if (
        lookAhead(parser, OPERATOR, "*") ||
        lookAhead(parser, OPERATOR, "/")
    ) {
        const op = match(parser, OPERATOR).value;
        const [subExpr, subVars] = parseNumFactor(parser);
        expr += ` ${op} ${subExpr}`;
        vars = vars.concat(subVars);
    }

    return [expr, vars];
};

const parseNumExpr = function (parser) {
    let [expr, vars] = parseNumTerm(parser);
    if (
        lookAhead(parser, OPERATOR, "+") ||
        lookAhead(parser, OPERATOR, "-")
    ) {
        const op = match(parser, OPERATOR).value;
        const [subExpr, subVars] = parseNumTerm(parser);
        expr += ` ${op} ${subExpr}`;
        vars = vars.concat(subVars);
    }

    return [expr, vars];
};

const parseCompExpr = function (parser) {
    const [leftExpr, leftVars] = parseNumExpr(parser);
    const op = match(parser, OPERATOR).value;
    const [rightExpr, rightVars] = parseNumExpr(parser);
    return [
        `${leftExpr} ${op} ${rightExpr}`,
        leftVars.concat(rightVars)
    ];
};

const parseBoolExprUnit = function (parser) {
    let boolExpr = "";
    let variables = [];

    if (
        lookAhead(parser, KEYWORD, "true") ||
        lookAhead(parser, KEYWORD, "false")
    ) {
        boolExpr = match(parser, KEYWORD).value;
    } else if (lookAhead(parser, KEYWORD, "not")) {
        match(parser, KEYWORD);
        const [expr, vars] = parseBoolExpr(parser);
        boolExpr = `!${expr}`;
        variables = variables.concat(vars);
    } else if (lookAhead(parser, BRACKET_OPEN, "(")) {
        match(parser, BRACKET_OPEN, "(");
        const [expr, vars] = parseBoolExpr(parser);
        boolExpr = `(${expr})`;
        variables = variables.concat(vars);
        match(parser, BRACKET_CLOSE, ")");
    } else {
        const [expr, vars]  = parseCompExpr(parser);
        boolExpr = expr;
        variables = variables.concat(vars);
    }
     
    return [boolExpr, variables];   
};

const parseBoolFactor = function (parser) {
    return parseBoolExprUnit(parser);
};

const parseBoolTerm = function (parser) {
    let [expr, vars] = parseBoolFactor(parser);
    if (lookAhead(parser, KEYWORD, "and")) {
        match(parser, KEYWORD);
        const [subExpr, subVars] = parseBoolFactor(parser);
        expr += ` && ${subExpr}`;
        vars = vars.concat(subVars);
    }
    return [expr, vars];
};

const parseBoolExpr = function (parser) {
    let [expr, vars] = parseBoolTerm(parser);
    if (lookAhead(parser, KEYWORD, "or")) {
        match(parser, KEYWORD);
        const [subExpr, subVars] = parseBoolTerm(parser);
        expr += ` || ${subExpr}`;
        vars = vars.concat(subVars);
    }
    return [expr, vars];
};

const parseActualParameter = function (parser) {
    const [expr, vars] = parseNumExpr(parser);
    return new NumericalExpression(vars, expr);
};

const parseActualModule = function (parser) {
    const moduleNameToken = match(parser, IDENTIFIER, undefined, MODULE_NAME);
    const moduleName = moduleNameToken.value;

    if (!defined(parser, moduleName, MODULE)) {
        throw new ParseError(`Module '${moduleName}' at position ${moduleToken.position()} not in the alphabet.`);
    }

    let actualParameters = [];
   
    if (lookAhead(parser, BRACKET_OPEN, "(")) {
        match(parser, BRACKET_OPEN, "(");
        actualParameters = parseList(parser, parseActualParameter);
        match(parser, BRACKET_CLOSE, ")");

        // TODO: check match formal module
    }

    return new Module(moduleName, actualParameters);
};

const parseSuccessor = function (parser) {
    const successor = new Successor();

    while (
        lookAhead(parser, IDENTIFIER, undefined, 1, MODULE_NAME) || 
        lookAhead(parser, BRACKET_OPEN, "[")
    ) {
        if (lookAhead(parser, BRACKET_OPEN, "[")) {
            // Match a sub tree
            match(parser, BRACKET_OPEN, "[");
            successor.push(parseSuccessor(parser));
            match(parser, BRACKET_CLOSE, "]");
        } else {
            // Match a module in the successor
            successor.push(parseActualModule(parser));
        }
    }

    return successor;
};

const parseAxiom = function (parser) {
    match(parser, KEYWORD, "axiom");
    match(parser, DELIMITER, ":");
    const axiom = parseSuccessor(parser);
    return axiom;
};


const parseStochasticSuccessorList = function (parser) {
    const stochasticSuccessorList = [];
    match(parser, BRACKET_OPEN, "{");
    while (lookAhead(parser, NUMBER)) {
        const probability = match(parser, NUMBER).value;
        match(parser, OPERATOR, "->");
        const successor = parseSuccessor(parser);
        stochasticSuccessorList.push({probability, successor});
        if (lookAhead(parser, DELIMITER, ",")) {
            match(parser, DELIMITER, ",");
        }
    }
    match(parser, BRACKET_CLOSE, "}");

    // The propabilities should add up to 1.0 exactly.
    const totalProbability = stochasticSuccessorList.reduce((sum, ps) => {
        return sum + ps.probability;
    }, 0);

    if (totalProbability !== 1) {
        throw new ParseError(`The probabilities of one module should add up to 1 exact, it adds up to ${totalProbability} instead.`);
    }

    return stochasticSuccessorList;
};

const parsePredecessor = function (parser) {
    const modules = [];
    let hasLeftContext = false;
    let hasRightContext = false;
   
    modules.push(parseActualModule(parser));
    
    if (lookAhead(parser, BRACKET_OPEN, "<", 1, CONTEXT)) {
        match(parser, BRACKET_OPEN, "<", CONTEXT);
        modules.push(parseActualModule(parser));
        hasLeftContext = true;
    }
    
    if (lookAhead(parser, BRACKET_CLOSE, ">", 1, CONTEXT)) {
        match(parser, BRACKET_CLOSE, ">", CONTEXT);
        modules.push(parseActualModule(parser));
        hasRightContext = true;
    }

    let predecessor = undefined;

    if (1 === modules.length) {
        predecessor = new Predecessor(modules[0]);
    } else if (2 === modules.length) {
        if (hasLeftContext) {
            predecessor = new Predecessor(modules[1]);
            predecessor.leftContext = modules[0];
        } else {
            predecessor = new Predecessor(modules[0]);
            predecessor.rightContext = modules[1];
        }
    } else {
        predecessor = new Predecessor(modules[1]);
        predecessor.leftContext = modules[0];
        predecessor.rightContext = modules[2];
    }

    return predecessor;
};

const parseProduction = function (parser) {
    let production = undefined;
    const predecessor = parsePredecessor(parser);
    let successor = undefined;
    let condition = undefined;
    
    if (lookAhead(parser, DELIMITER, ":")) {
        match(parser, DELIMITER, ":");
        if (!lookAhead(parser, BRACKET_OPEN, "{")) {
            const [expr, vars] = parseBoolExpr(parser);
            condition = new BooleanExpression(vars, expr);
        }
    }
    
    if (lookAhead(parser, BRACKET_OPEN, "{")) {
        successor = parseStochasticSuccessorList(parser);
        production = new StochasticProduction(predecessor, successor, condition);
    } else if (lookAhead(parser, OPERATOR, "->")) {
        match(parser, OPERATOR, "->");
        successor = parseSuccessor(parser);
        production = new Production(predecessor, successor, condition);
    }

    return production;
};

const parseProductions = function (parser) {
    match(parser, KEYWORD, "productions");
    match(parser, DELIMITER, ":");
    match(parser, BRACKET_OPEN, "{");
    const productions = parseList(parser, parseProduction, "}");
    match(parser, BRACKET_CLOSE, "}");
    return productions;
};

const parseLSystem = function (parser) {
    match(parser, KEYWORD, "lsystem");
    match(parser, BRACKET_OPEN, "(");
    const alphabet = parseAlphabet(parser);
    match(parser, DELIMITER, ",");
    const axiom = parseAxiom(parser);
    match(parser, DELIMITER, ",");
    const productions = parseProductions(parser);
    match(parser, BRACKET_CLOSE, ")");
    const lsystem = new LSystem(alphabet, axiom, productions);
    return lsystem;
};

/**
 * Parser for LSystem input strings
 */
class Parser {

    /**
     * Create a new Parser
     */
    constructor() {
    }

    /**
     * Parse a LSYSTEM definition input string
     *
     * @param {String} input - the input string to parse
     *
     * @returns {LSystem}
     */
    parse(input) {
        _lexer.set(this, new Lexer(input));
        _idTable.set(this, []);
        return parseLSystem(this);
    }
}

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
const _alphabet = new WeakMap();
const _axiom = new WeakMap();
const _productions = new WeakMap();
const _currentDerivation = new WeakMap();


const findProduction = function (lsystem, module) {
    const candidates = lsystem
        .productions
        .filter((p) => p.predecessor.matches(module));

    if (0 < candidates.length) {
        return candidates[0];
    } else {
        // Modules that do not match any production are copied to the
        // successor directly. This is also known as the 'identity' production
        // rule.
        return new IdentityProduction(module);
    }
};

const derive = function(lsystem, moduleTree) {
    const successor = new Successor();

    for (const node of moduleTree) {
        if (node instanceof ModuleTree) {
            successor.push(derive(lsystem, node));
        } else {
            const production = findProduction(lsystem, node);
            const rewrittenNode = production.follow();

            for (const successorNode of rewrittenNode) {
                successor.push(successorNode);
            }
        }
    }

    return successor;
};

/**
 * An LSystem model
 *
 * @property {Alphabet} alphabet - the set of modules of this LSystem
 * @property {ModuleTree} axiom - the axion of this LSystem
 * @property {Production[]} productions - the set of productions of this
 * LSystem
 */
const LSystem = class {
    /**
     * Create a new instance of LSystem.
     *
     * @param {Alphabet} alphabet
     * @param {ModuleTree} axiom
     * @param {Production[]} productions
     */
    constructor(alphabet, axiom, productions) {
        _alphabet.set(this, alphabet);
        _axiom.set(this, axiom);
        _productions.set(this, productions);
        _currentDerivation.set(this, axiom);
    }

    /**
     * Parse an LSystem input string and return the represented LSystem.
     *
     * @param {String} input
     * @returns {LSystem} the parsed LSystem
     * @throws {ParseError|LexicalError} if something goes wrong during
     * parsing, an error is thrown.
     */
    static parse(input) {
        return (new Parser()).parse(input);
    }

    get alphabet() {
        return _alphabet.get(this);
    }

    get axiom() {
        return _axiom.get(this);
    }

    get productions() {
        return _productions.get(this);
    }

    /**
     * Create a String representation of this LSystem. This representation can
     * be parsed again to an LSystem equal to this one.
     *
     * @return {String}
     */
    stringify() {
        return `lsystem(alphabet: {${this.alphabet.stringify()}}, axiom: ${this.axiom.stringify()}, productions: {${this.productions.map((p) => p.stringify()).join(", ")}})`;
    }

    /**
     * Taking the current state of this LSystem as the predecessor, derive a
     * successor.
     *
     * @param {Number} [steps = 1] - the number of derivations to perform,
     * defaults to one step.
     *
     * @returns {Successor} the successor.
     */
    derive(steps = 1) {
        for (let i = 0; i < steps; i++) {
            // do a derivation
            _currentDerivation.set(this, derive(this, _currentDerivation.get(this)));
        }
        return _currentDerivation.get(this);
    }
};

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

const _function = new WeakMap();

class Command {
    constructor(...args) {
        let func;

        if (0 >= args.length) {
            // create an empty function; does do nothing
            func = function () {};
        } else if (1 === args.length) {
            // create with a function or a constant
            if ("function" === typeof args[0]) {
                func = args[0];
            } else {
                func = function () { return args[0]; };
            }
        } else if (2 === args.length) {
            // create with formal parameters and a function body in a string
            func = new Function(args[0], args[1]);
        } else {
            // ?
            throw new Error(`Expected at most 2 arguments, got ${args.length} instead.`);
        }

        _function.set(this, func);
    }

    /**
     * Execute this Command in this interpretation given the supplier
     * parameters
     *
     * @param {Interpretation} interpretation - the interpretation in which this command is executed
     * @param {Array} [parameters = []] - the parameters used in this Commmand
     */
    execute(interpretation, parameters = []) {
        _function.get(this).apply(interpretation, parameters);
    }
}

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
const _commands = new WeakMap();
const _initialState = new WeakMap();
const _states = new WeakMap();

const renderTree = function (interpretation, moduleTree) {
    for (const item of moduleTree) {
        if (Array.isArray(item)) {
            interpretation.enter();
            renderTree(interpretation, item);
            interpretation.exit();
        } else {
            interpretation.execute(item.name, item.parameters);
        }
    }
};

/**
 * An Interpretation of a LSystem
 *
 * @property {Object} state - the current state of this Interpretation.
 */
class Interpretation {
    /**
     * Create a new instance of an LSystem Interpretation.
     * 
     * @param {RenderingContext|SVGElement} canvas - the canvas to draw on.
     * @param {Object} scope - the scope of this Interpretation.
     */
    constructor(initialState = {}) {
        _initialState.set(this, initialState);
        _states.set(this, []);
        _commands.set(this, {});
    }

    get state() {
        const states = _states.get(this);
        if (0 === states.length) {
            this.initialize();
        }

        return states[states.length - 1];
    }

    /**
     * A command function has the following signature:
     *
     * @callback commandFunction
     * @param {Number[]} [parameters = []] - a list of numerical parameters
     * you can use in the command;
     */

    /**
     * Execute a command with given parameters in the context of this
     * Interpretation.
     *
     * @param {String} name - the name of the command to execute.
     * @param {Array} [parameters = []] - an optional list of actual
     * parameters to apply when the command is executed.
     */
    execute(name, parameters = []) {
        const command = _commands.get(this)[name];

        if (undefined === command) {
            throw new Error(`This interpretation has no command '${name}' to execute.`);
        }

        if ("string" === typeof command) {
            this.execute(command, parameters);
        } else if (command instanceof Command) {
            command.execute(this, parameters);
        } else {
            throw new Error(`'${name}' is not an executable command in this interpretation.`);
        }
    }

    /**
     * Set a property of this Interpretation.
     *
     * @param {String} name - the name of the property.
     * @param {Object} value - the new value of the property.
     */
    setProperty(name, value) {
        this.state[name] = value;
    }

    /**
     * Get a property of this Interpretation. If no such property exists, or
     * if its value is undefined or null, return the defaultValue.
     *
     * @param {String} name - the name of the property.
     * @param {defaultValue} [defaultValue = 0] - the default value of this
     * property if no such property exists or its value is undefined or null.
     *
     * @returns {Object} the value of the property.
     */
    getProperty(name, defaultValue = 0) {
        const value = this.state[name];
        return (undefined === value || null === value) ? defaultValue : value;
    }


    /**
     * Set a command in this Interpretation.
     *
     * @param {String} name - the name of the command to set.
     * @param {Command} command - the command.
     */
    setCommand(name, command) {
        _commands.get(this)[name] = command;
    }

    /**
     * Alias a command.
     *
     * @param {String|String[]} aliasNames - a list of aliases for command.
     * @param {String} commandName - a command's name.
     */
    alias(aliasNames, commandName) {
        if (!Array.isArray(aliasNames)) {
            aliasNames = [aliasNames];
        }

        for(const alias of aliasNames) {
            _commands.get(this)[alias] = commandName;
        }
    }

    /**
     * Get a command in this Interpretation.
     *
     * @param {String} name - the name of the command to get.
     * @returns {Command|undefined}
     */
    getCommand(name) {
        const command = _commands.get(this)[name];

        if (command instanceof Command) {
            return command;
        } else if ("string" === typeof command) {
            return getCommand(command);
        } else {
            return undefined;
        }
    }

    /**
     * Initialize a new rendering of this interpretation.
     */
    initialize() {
        _states.set(this, [_initialState.get(this)]);
    }

    /**
     * Render a moduleTree given this Interpretation.
     *
     * @param {ModuleTree} moduleTree - the moduleTree to render on the
     * canvas.
     */
    render(moduleTree) {
        this.initialize();
        renderTree(this, moduleTree);
        this.finalize();
    }

    /**
     * Enter a sub tree.
     */
    enter() {
        const currentState = Object.assign({}, this.state);
        _states.get(this).push(currentState);
    }

    /**
     * Exit a sub tree.
     */
    exit() {
        _states.get(this).pop();
    }

    /**
     * Finalize a rendering of this interpretation.
     */
    finalize() {
    }
}

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
// Default values
const X = 0;
const Y = 0;
const D = 2;
const DELTA = Math.PI / 2;
const ALPHA = 0;

class TurtleInterpretation extends Interpretation {
    constructor(initialState = {}) {
        super(initialState);

        this.setCommand("+", new Command(function () {
            this.alpha = this.alpha + this.delta;
        }));

        this.setCommand("-", new Command(function () {
            this.alpha = this.alpha - this.delta;
        }));

        this.setCommand("f", new Command(function () {
            this.x = this.x + this.d * Math.cos(this.alpha);
            this.y = this.y + this.d * Math.sin(this.alpha);

            this.moveTo(this.x, this.y);
        }));
        
        this.setCommand("F", new Command(function () {
            this.x = this.x + this.d * Math.cos(this.alpha);
            this.y = this.y + this.d * Math.sin(this.alpha);

            this.lineTo(this.x, this.y);
        }));


        this.alias(["Fl", "Fr"], "F");
    }

    moveTo(x, y) {
        // to be implemented by a sub class 
    }

    lineTo(x, y) {
        // to be implemented by a sub class 
    }

    get x() {
        return this.getProperty("x", X);
    }

    set x(value = 0) {
        this.setProperty("x", value);
    }

    get y() {
        return this.getProperty("y", Y);
    }

    set y(value = 0) {
        this.setProperty("y", value);
    }

    get d() {
        return this.getProperty("d", D);
    }

    set d(value = 1) {
        this.setProperty("d", value);
    }

    get alpha() {
        return this.getProperty("alpha", ALPHA);
    }

    set alpha(value = 0) {
        this.setProperty("alpha", value);
    }

    get delta() {
        return this.getProperty("delta", DELTA);
    }

    set delta(value = 1) {
        this.setProperty("delta", value);
    }

}

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
const _canvas = new WeakMap();

class CanvasTurtleInterpretation extends TurtleInterpretation {
    constructor(canvas, initialState = {}) {
        super(initialState);
        _canvas.set(this, canvas);
    }

    initialize() {
        super.initialize();
        const canvas = _canvas.get(this);
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.beginPath();
        canvas.moveTo(this.x, this.y);
    }

    finalize() {
        super.finalize();
        const canvas = _canvas.get(this);
        if (this.getProperty("close", true)) {
            canvas.closePath();
        }
        canvas.stroke();
    }

    moveTo(x, y) {
        _canvas.get(this).moveTo(x, y);
    }

    lineTo(x, y) {
        _canvas.get(this).lineTo(x, y);
    }

    enter() {
        const canvas = _canvas.get(this);
        canvas.stroke();
        canvas.save();
        super.enter();
        canvas.beginPath();
        canvas.moveTo(this.x, this.y);
    }

    exit() {
        const canvas = _canvas.get(this);
        canvas.stroke();
        canvas.closePath();
        canvas.restore();
        super.exit();
    }
        
}

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

export { LexicalError, ParseError, LSystem, Interpretation, TurtleInterpretation, CanvasTurtleInterpretation };