document.addEventListener('DOMContentLoaded', () => {

    // Function to display steps one by one
    const displaySteps = async (steps, containerId, listId) => {
        const container = document.getElementById(containerId);
        const list = document.getElementById(listId);

        container.style.display = 'block';
        list.innerHTML = '';

        for (let i = 0; i < steps.length; i++) {
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item';
            stepItem.innerHTML = `<span class="step-number">Step ${i + 1}:</span> ${steps[i]}`;
            list.appendChild(stepItem);

            // Trigger animation
            await new Promise(resolve => setTimeout(resolve, 100));
            stepItem.classList.add('show');

            // Wait before showing next step
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    };

    // --- DAA: Counting Sort Handler ---
    const sortBtn = document.getElementById('sort-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', async () => {
            const inputField = document.getElementById('numbers-input');
            const resultBox = document.getElementById('result-box');
            const sortedOutput = document.getElementById('sorted-output');
            const errorMsg = document.getElementById('error-msg');
            const stepsContainer = document.getElementById('steps-container');

            // Reset states
            resultBox.style.display = 'none';
            errorMsg.style.display = 'none';
            if (stepsContainer) stepsContainer.style.display = 'none';

            const inputData = inputField.value.trim();
            if (!inputData) {
                errorMsg.innerText = "Please enter some numbers.";
                errorMsg.style.display = 'block';
                return;
            }

            const numbers = inputData.split(',').map(n => n.trim()).filter(n => n !== "").map(Number);
            if (numbers.some(isNaN)) {
                errorMsg.innerText = "Invalid input. Please enter numbers separated by commas.";
                errorMsg.style.display = 'block';
                return;
            }

            sortBtn.disabled = true;
            sortBtn.innerText = "Processing...";

            try {
                const response = await fetch('/counting-sort', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ numbers })
                });

                const data = await response.json();

                if (response.ok) {
                    await displaySteps(data.steps, 'steps-container', 'steps-list');
                    sortedOutput.innerText = data.sorted.join(', ');
                    resultBox.style.display = 'block';
                } else {
                    errorMsg.innerText = data.error || "An error occurred.";
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = "Connection failed.";
                errorMsg.style.display = 'block';
            } finally {
                sortBtn.disabled = false;
                sortBtn.innerText = "Sort & Visualize Steps";
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
            const stepsContainer = document.getElementById('steps-container');

            // Result elements
            const originalData = document.getElementById('res-original');
            const parityBit = document.getElementById('res-bit');
            const transmittedData = document.getElementById('res-transmitted');
            const resType = document.getElementById('res-type');

            // Reset states
            resultBox.style.display = 'none';
            errorMsg.style.display = 'none';
            if (stepsContainer) stepsContainer.style.display = 'none';

            const binaryValue = binaryInput.value.trim();
            if (!binaryValue) {
                errorMsg.innerText = "Please enter a binary string.";
                errorMsg.style.display = 'block';
                return;
            }

            parityBtn.disabled = true;
            parityBtn.innerText = "Calculating...";

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
                    await displaySteps(data.steps, 'steps-container', 'steps-list');
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
                errorMsg.innerText = "Connection failed.";
                errorMsg.style.display = 'block';
            } finally {
                parityBtn.disabled = false;
                parityBtn.innerText = "Generate & Visualize Steps";
            }
        });
    }
});
