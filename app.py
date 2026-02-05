from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# --- ROUTES ---

@app.route('/')
def index():
    """Renders the common homepage."""
    return render_template('index.html')

@app.route('/daa')
def daa_page():
    """Renders the Counting Sort Visualizer page."""
    return render_template('daa.html')

@app.route('/cn')
def cn_page():
    """Renders the Parity Bit Generator & Checker page."""
    return render_template('cn.html')

# --- API ENDPOINTS ---

@app.route('/counting-sort', methods=['POST'])
def counting_sort_api():
    """
    Backend Logic for Counting Sort (DAA Project) with step-by-step recording.
    """
    try:
        data = request.get_json()
        if not data or 'numbers' not in data:
            return jsonify({"error": "Invalid input. Please provide a list of numbers."}), 400
        
        arr = data['numbers']
        if not all(isinstance(x, int) for x in arr):
            return jsonify({"error": "All inputs must be integers."}), 400

        if not arr:
            return jsonify({"sorted": [], "steps": ["Array is empty. Nothing to sort."]})

        steps = []
        steps.append(f"Input Data: {arr}")

        # 1. Finding Range
        max_val = max(arr)
        min_val = min(arr)
        range_of_elements = max_val - min_val + 1
        steps.append(f"Find range: Max={max_val}, Min={min_val}. Range needed: {range_of_elements}")

        # 2. Initializing Count Array
        count = [0] * range_of_elements
        steps.append(f"Initialize Count Array of size {range_of_elements} with 0s: {count}")

        # 3. Store count of each element
        for num in arr:
            count[num - min_val] += 1
        steps.append(f"Frequencies counted: {count}")

        # 4. Cumulative counts
        for i in range(1, len(count)):
            count[i] += count[i - 1]
        steps.append(f"Cumulative counts (used to find positions): {count}")

        # 5. Build the output array
        output = [0] * len(arr)
        for i in range(len(arr) - 1, -1, -1):
            output[count[arr[i] - min_val] - 1] = arr[i]
            count[arr[i] - min_val] -= 1
        
        steps.append(f"Output array constructed by placing elements in their correct sorted positions.")
        steps.append(f"Final Sorted Result: {output}")

        return jsonify({"sorted": output, "steps": steps})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/parity', methods=['POST'])
def parity_api():
    """
    Backend Logic for Parity Bit (CN Project) with step-by-step recording.
    """
    try:
        data = request.get_json()
        binary_str = data.get('binary', '')
        parity_type = data.get('type', 'even').lower()

        if not all(c in '01' for c in binary_str) or not binary_str:
            return jsonify({"error": "Invalid binary string. Use only 0s and 1s."}), 400
        
        if parity_type not in ['even', 'odd']:
            return jsonify({"error": "Invalid parity type. Use 'even' or 'odd'."}), 400

        steps = []
        steps.append(f"Input binary data: {binary_str}")
        
        ones_count = binary_str.count('1')
        steps.append(f"Count of '1' bits: {ones_count}")

        # Determine logic
        is_count_even = (ones_count % 2 == 0)
        steps.append(f"The count of 1s ({ones_count}) is {'Even' if is_count_even else 'Odd'}.")

        if parity_type == 'even':
            steps.append(f"Target: Even Parity (Total 1s should be even).")
            if is_count_even:
                parity_bit = '0'
                steps.append(f"Current 1s are already even. Set Parity Bit = 0.")
            else:
                parity_bit = '1'
                steps.append(f"Current 1s are odd. Set Parity Bit = 1 to make total even.")
        else:
            steps.append(f"Target: Odd Parity (Total 1s should be odd).")
            if is_count_even:
                parity_bit = '1'
                steps.append(f"Current 1s are even. Set Parity Bit = 1 to make total odd.")
            else:
                parity_bit = '0'
                steps.append(f"Current 1s are already odd. Set Parity Bit = 0.")

        transmitted_data = binary_str + parity_bit
        steps.append(f"Final Transmitted Data: {binary_str} + [{parity_bit}] = {transmitted_data}")

        return jsonify({
            "original": binary_str,
            "parity_bit": parity_bit,
            "transmitted": transmitted_data,
            "type": parity_type,
            "steps": steps
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Running on port 5000 in debug mode for development
    app.run(debug=True, port=5000)
