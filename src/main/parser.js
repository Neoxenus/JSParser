const acorn = require('acorn');
const fs = require('fs');


// Path to the file you want to read
const filePath = 'resources/input.txt';
let text;
// Read the file synchronously
try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    text = `${fileContents}`;
} catch (err) {
    console.error(err);
}
// JavaScript code to parse
const javascriptCode = text;



// Parse the JavaScript code and retrieve the AST
const ast = acorn.parse(javascriptCode, { ecmaVersion: 2023 });

// Build the AST as a tree
const root = buildAST(ast, javascriptCode);

// Display the AST as a tree
displayAST(root, '');

function buildAST(node, code) {
    const type = node.type;
    const value = getValue(node, code);
    const children = [];

    for (const key in node) {
        if (key !== 'type' && key !== 'start' && key !== 'end' && typeof node[key] === 'object' && node[key] !== null) {
            //console.log(node[key]);
            if (Array.isArray(node[key])) {
                for (const childNode of node[key]) {
                    children.push(buildAST(childNode, code));
                }
            } else {
                children.push(buildAST(node[key], code));
            }
        }
    }

    return { type, value, children };
}

function displayAST(node, indent) {
    console.log(indent + node.type + (node.value ? ': ' + node.value : ''));
    for (const child of node.children) {
        displayAST(child, indent + '  ');
    }
}

function getValue(node, code) {
    if (node.type === 'UnaryExpression' || node.type === "BinaryExpression") {
        return "operator " + node.operator;
    }
    if (node.type === 'Identifier' || node.type === 'Literal') {
        return code.slice(node.start, node.end);
    }
    return null;
}