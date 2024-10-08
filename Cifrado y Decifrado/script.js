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
    text = text.replace(/\s/g, '');
    let numCols = key.length;
    let numRows = Math.ceil(text.length / numCols);

    // Crear una matriz vacía (grid) para representar las columnas
    let grid = Array(numRows).fill("").map(() => Array(numCols).fill(""));
    
    // Llenar la matriz con los caracteres del texto
    let index = 0;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            
                if (index < text.length) {
                    grid[row][col] = text[index++];
                } else {
                    grid[row][col] = '-';  // Rellenar con caracteres de relleno si es necesario
                }
            }
            
        }
    
    console.log(grid)
    // Reordenar columnas según la clave
    let keyValuePairs = [];
    for (let i = 0; i < key.length; i++) {
        keyValuePairs.push([key[i], i]);
    }

    // Ordenar los pares por el valor de la clave (primer elemento)
    keyValuePairs.sort((a, b) => a[0] - b[0]);

    // Reordenar las columnas según la clave ordenada
    let orderedGrid = [];
    keyValuePairs.forEach(pair => {
        let colIndex = pair[1];  // Tomar el índice original
        for (let row = 0; row < numRows; row++) {
            orderedGrid.push(grid[row][colIndex]);
        }
    });

    console.log(orderedGrid)
    return orderedGrid.join('');
    
   
}

// Transposición Columnar Doble
function transposicionDoble(text, key1, key2) {
    let firstPass = transposicionSimple(text, key1);
    return transposicionSimple(firstPass, key2);
}

// Descifrado Transposición Columnar Simple
function descifrarTransposicionSimple(cipherText, key) {
    if (!cipherText || !key) {
        throw new Error("El texto cifrado y la clave no pueden estar vacíos.");
    }

    let numCols = key.length;
    let numRows = Math.ceil(cipherText.length / numCols);

    // Crear una matriz vacía para el texto cifrado
    let grid = Array(numRows).fill("").map(() => Array(numCols).fill(""));

    // Crear un array con pares [valor de la clave, índice original]
    let keyValuePairs = [];
    for (let i = 0; i < key.length; i++) {
        keyValuePairs.push([key[i], i]);
    }

    // Ordenar los pares por el valor de la clave (primer elemento)
    keyValuePairs.sort((a, b) => a[0] - b[0]);

    // Rellenar las columnas del grid en el orden de la clave ordenada
    let index = 0;
    keyValuePairs.forEach(pair => {
        let colIndex = pair[1];  // Tomar el índice original
        for (let row = 0; row < numRows; row++) {
            if (index < cipherText.length) {
                grid[row][colIndex] = cipherText[index++];
            }
        }
    });

    // Leer las filas para obtener el texto descifrado
    let decryptedText = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (grid[row][col] !== '-') {  // Ignorar caracteres de relleno
                decryptedText.push(grid[row][col]);
            }
        }
    }

    return decryptedText.join('');
}

// Descifrado Transposición Columnar Doble
function descifrarTransposicionDoble(text, key1, key2) {
    let firstPass = descifrarTransposicionSimple(text, key2);
    return descifrarTransposicionSimple(firstPass, key1);
}

// Manejo de cifrado
function encrypt() {
    try {
        const method = document.getElementById("cipher-method").value;
        const inputText = document.getElementById("cipher-input").value.trim();

        if (!inputText) {
            throw new Error("El campo de texto a cifrar no puede estar vacío.");
        }

        let outputText = "";

        if (method === "cesar") {
            const shift = parseInt(document.getElementById("shift-value").value);
            if (isNaN(shift)) {
                throw new Error("Por favor, introduce un valor de desplazamiento válido.");
            }
            outputText = caesarCipher(inputText, shift);
        } else if (method === "atbash") {
            outputText = atbashCipher(inputText);
        } else if (method === "transposicion-simple") {
            const key = document.getElementById("key-value").value.trim();
            if (!key) {
                throw new Error("Por favor, introduce una clave de transposición.");
            }
            outputText = transposicionSimple(inputText, key);
        } else if (method === "transposicion-doble") {
            const key1 = document.getElementById("key-value").value.trim();
            const key2 = document.getElementById("key2-value").value.trim();
            if (!key1 || !key2) {
                throw new Error("Por favor, introduce ambas claves de transposición.");
            }
            outputText = transposicionDoble(inputText, key1, key2);
        }

        document.getElementById("cipher-output").textContent = outputText;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Manejo de descifrado
function decrypt() {
    try {
        const method = document.getElementById("decipher-method").value;
        const inputText = document.getElementById("decipher-input").value.trim();

        if (!inputText) {
            throw new Error("El campo de texto a descifrar no puede estar vacío.");
        }

        let outputText = "";

        if (method === "transposicion-simple") {
            const key = document.getElementById("key-value-decipher").value.trim();
            if (!key) {
                throw new Error("Por favor, introduce una clave de transposición.");
            }
            outputText = descifrarTransposicionSimple(inputText, key);
        } else if (method === "transposicion-doble") {
            const key1 = document.getElementById("key-value-decipher").value.trim();
            const key2 = document.getElementById("key2-value-decipher").value.trim();
            if (!key1 || !key2) {
                throw new Error("Por favor, introduce ambas claves de transposición.");
            }
            outputText = descifrarTransposicionDoble(inputText, key1, key2);
        }

        document.getElementById("decipher-output").textContent = outputText;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
