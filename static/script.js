document.addEventListener('DOMContentLoaded', () => {
    // --- DAA: Counting Sort Handler ---
    const sortBtn = document.getElementById('sort-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', async () => {
            const inputField = document.getElementById('numbers-input');
            const resultBox = document.getElementById('result-box');
            const sortedOutput = document.getElementById('sorted-output');
            const errorMsg = document.getElementById('error-msg');

            // Reset states
            resultBox.style.display = 'none';
            errorMsg.style.display = 'none';

            const inputData = inputField.value.trim();
            if (!inputData) {
                errorMsg.innerText = "Please enter some numbers.";
                errorMsg.style.display = 'block';
                return;
            }

            // Convert input to array of integers
            const numbers = inputData.split(',').map(n => n.trim()).filter(n => n !== "").map(Number);

            // Check for NaNs
            if (numbers.some(isNaN)) {
                errorMsg.innerText = "Invalid input. Please enter numbers separated by commas.";
                errorMsg.style.display = 'block';
                return;
            }

            try {
                const response = await fetch('/counting-sort', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ numbers })
                });

                const data = await response.json();

                if (response.ok) {
                    sortedOutput.innerText = data.sorted.join(', ');
                    resultBox.style.display = 'block';
                } else {
                    errorMsg.innerText = data.error || "An error occurred.";
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = "Connection failed. Make sure the server is running.";
                errorMsg.style.display = 'block';
                console.error(err);
            }
        });
    }

    // --- CN: Parity Bit Handler ---
    const parityBtn = document.getElementById('parity-btn');
    if (parityBtn) {
        parityBtn.addEventListener('click', async () => {
            const binaryInput = document.getElementById('binary-input');
            const parityType = document.getElementById('parity-type');
            const resultBox = document.getElementById('result-box');
            const errorMsg = document.getElementById('error-msg');

            // Result elements
            const originalData = document.getElementById('res-original');
            const parityBit = document.getElementById('res-bit');
            const transmittedData = document.getElementById('res-transmitted');
            const resType = document.getElementById('res-type');

            // Reset states
            resultBox.style.display = 'none';
            errorMsg.style.display = 'none';

            const binaryValue = binaryInput.value.trim();
            if (!binaryValue) {
                errorMsg.innerText = "Please enter a binary string.";
                errorMsg.style.display = 'block';
                return;
            }

            try {
                const response = await fetch('/parity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        binary: binaryValue,
                        type: parityType.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    originalData.innerText = data.original;
                    parityBit.innerText = data.parity_bit;
                    transmittedData.innerText = data.transmitted;
                    resType.innerText = data.type.toUpperCase();
                    resultBox.style.display = 'block';
                } else {
                    errorMsg.innerText = data.error || "An error occurred.";
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = "Connection failed. Make sure the server is running.";
                errorMsg.style.display = 'block';
                console.error(err);
            }
        });
    }
});
