// Mostrar/ocultar campos según el método seleccionado
function toggleFields() {
    const method = document.getElementById("cipher-method").value;
    const shiftField = document.getElementById("shift-field");
    const key1Field = document.getElementById("key1-field");
    const key2Field = document.getElementById("key2-field");

    // Restablecer todos los campos
    shiftField.style.display = "none";
    key1Field.style.display = "none";
    key2Field.style.display = "none";

    // Mostrar campos según el método seleccionado
    if (method === "cesar") {
        shiftField.style.display = "block";
    } else if (method === "transposicion-simple") {
        key1Field.style.display = "block";
    } else if (method === "transposicion-doble") {
        key1Field.style.display = "block";
        key2Field.style.display = "block";
    }
}

// Cifrado César
function caesarCipher(text, shift) {
    if (isNaN(shift) || shift < 1 || shift > 25) {
        throw new Error("El valor de desplazamiento debe estar entre 1 y 25.");
    }
    return text.split('').map(char => {
        let code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) { // Mayúsculas
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) { // Minúsculas
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char; // Mantener otros caracteres
    }).join('');
}

// Cifrado Atbash
function atbashCipher(text) {
    return text.split('').map(char => {
        let code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) { // Mayúsculas
            return String.fromCharCode(90 - (code - 65));
        } else if (code >= 97 && code <= 122) { // Minúsculas
            return String.fromCharCode(122 - (code - 97));
        }
        return char; // Mantener otros caracteres
    }).join('');
}

// Transposición Columnar Simple
function transposicionSimple(text, key) {
    if (!text || !key) {
        throw new Error("El texto y la clave no pueden estar vacíos.");
    }

    let numCols = key.length;
    let numRows = Math.ceil(text.length / numCols);
    let grid = Array(numCols).fill("").map(() => []);

    for (let i = 0; i < text.length; i++) {
        grid[i % numCols].push(text[i]);
    }

    // Reordenar columnas según la clave
    let orderedGrid = [];
    for (let i = 0; i < key.length; i++) {
        let colIndex = parseInt(key[i]) - 1;
        orderedGrid.push(grid[colIndex]);
    }

    return orderedGrid.flat().join('');
}

// Transposición Columnar Doble
function transposicionDoble(text, key1, key2) {
    let firstPass = transposicionSimple(text, key1);
    return transposicionSimple(firstPass, key2);
}

// Manejo de cifrado
function encrypt() {
    try {
        const method = document.getElementById("cipher-method").value;
        const inputText = document.getElementById("cipher-input").value; // Quitar .trim()

        if (!inputText) {
            throw new Error("El campo de texto no puede estar vacío.");
        }

        let outputText = "";

        if (method === "cesar") {
            const shift = parseInt(document.getElementById("shift-value").value);
            if (isNaN(shift)) {
                throw new Error("Introduce un valor de desplazamiento válido.");
            }
            outputText = caesarCipher(inputText, shift);
        } else if (method === "atbash") {
            outputText = atbashCipher(inputText);
        } else if (method === "transposicion-simple") {
            const key = document.getElementById("key-value").value.trim();
            if (!key) {
                throw new Error("Introduce una clave de transposición.");
            }
            outputText = transposicionSimple(inputText, key);
        } else if (method === "transposicion-doble") {
            const key1 = document.getElementById("key-value").value.trim();
            const key2 = document.getElementById("key2-value").value.trim();
            if (!key1 || !key2) {
                throw new Error("Introduce ambas claves de transposición.");
            }
            outputText = transposicionDoble(inputText, key1, key2);
        }

        // Mostrar el resultado respetando los saltos de línea
        document.getElementById("output").style.display = "block";
        document.getElementById("output").innerHTML = outputText.replace(/\n/g, "<br>");
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
// Manejo de descifrado
function decrypt() {
    try {
        const method = document.getElementById("cipher-method").value;
        const inputText = document.getElementById("cipher-input").value; // Quitar .trim()

        if (!inputText) {
            throw new Error("El campo de texto no puede estar vacío.");
        }

        let outputText = "";

        if (method === "cesar") {
            const shift = parseInt(document.getElementById("shift-value").value);
            if (isNaN(shift)) {
                throw new Error("Introduce un valor de desplazamiento válido.");
            }
            outputText = caesarCipher(inputText, 26 - shift); // Desplazamiento inverso
        } else if (method === "atbash") {
            outputText = atbashCipher(inputText); // Atbash es auto-inverso
        } else if (method === "transposicion-simple") {
            const key = document.getElementById("key-value").value.trim();
            if (!key) {
                throw new Error("Introduce una clave de transposición.");
            }
            outputText = descifrarTransposicionSimple(inputText, key);
        } else if (method === "transposicion-doble") {
            const key1 = document.getElementById("key-value").value.trim();
            const key2 = document.getElementById("key2-value").value.trim();
            if (!key1 || !key2) {
                throw new Error("Introduce ambas claves de transposición.");
            }
            outputText = descifrarTransposicionDoble(inputText, key1, key2);
        }

        // Mostrar el resultado respetando los saltos de línea
        document.getElementById("output").style.display = "block";
        document.getElementById("output").innerHTML = outputText.replace(/\n/g, "<br>");
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Función para descifrar la Transposición Columnar Simple
function descifrarTransposicionSimple(text, key) {
    let numCols = key.length;
    let numRows = Math.ceil(text.length / numCols);
    let grid = Array(numCols).fill("").map(() => []);
    let colLengths = Array(numCols).fill(numRows);

    // Ajustar para el último grupo de letras
    let totalChars = text.length;
    let extraChars = totalChars % numCols;
    for (let i = extraChars; i < numCols; i++) {
        colLengths[i]--;
    }

    let index = 0;
    for (let i = 0; i < key.length; i++) {
        let colIndex = parseInt(key[i]) - 1;
        for (let j = 0; j < colLengths[colIndex]; j++) {
            grid[colIndex].push(text[index++]);
        }
    }

    // Leer por filas
    let result = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (grid[col][row]) {
                result.push(grid[col][row]);
            }
        }
    }
    return result.join('');
}

// Función para descifrar la Transposición Columnar Doble
function descifrarTransposicionDoble(text, key1, key2) {
    let firstPass = descifrarTransposicionSimple(text, key2);
    return descifrarTransposicionSimple(firstPass, key1);
}