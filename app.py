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
    Backend Logic for Counting Sort (DAA Project).
    Expects JSON: { "numbers": [3, 1, 4, 1, 5, 9, 2, 6, 5] }
    """
    try:
        data = request.get_json()
        if not data or 'numbers' not in data:
            return jsonify({"error": "Invalid input. Please provide a list of numbers."}), 400
        
        arr = data['numbers']
        
        # Validation: Check if all elements are integers
        if not all(isinstance(x, int) for x in arr):
            return jsonify({"error": "All inputs must be integers."}), 400

        if not arr:
            return jsonify({"sorted": []})

        # Counting Sort Algorithm
        max_val = max(arr)
        min_val = min(arr)
        range_of_elements = max_val - min_val + 1
        
        count = [0] * range_of_elements
        output = [0] * len(arr)

        # Store count of each element
        for num in arr:
            count[num - min_val] += 1

        # Change count[i] so that count[i] contains actual position of this element in output array
        for i in range(1, len(count)):
            count[i] += count[i - 1]

        # Build the output array
        for i in range(len(arr) - 1, -1, -1):
            output[count[arr[i] - min_val] - 1] = arr[i]
            count[arr[i] - min_val] -= 1

        return jsonify({"sorted": output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/parity', methods=['POST'])
def parity_api():
    """
    Backend Logic for Parity Bit (CN Project).
    Expects JSON: { "binary": "1010", "type": "even" }
    """
    try:
        data = request.get_json()
        binary_str = data.get('binary', '')
        parity_type = data.get('type', 'even').lower()

        # Validation
        if not all(c in '01' for c in binary_str) or not binary_str:
            return jsonify({"error": "Invalid binary string. Use only 0s and 1s."}), 400
        
        if parity_type not in ['even', 'odd']:
            return jsonify({"error": "Invalid parity type. Use 'even' or 'odd'."}), 400

        # Count 1s
        ones_count = binary_str.count('1')
        
        # Determine Parity Bit
        if parity_type == 'even':
            # Even parity: total number of 1s (including parity) should be even
            parity_bit = '0' if ones_count % 2 == 0 else '1'
        else:
            # Odd parity: total number of 1s (including parity) should be odd
            parity_bit = '1' if ones_count % 2 == 0 else '0'

        transmitted_data = binary_str + parity_bit
        
        return jsonify({
            "original": binary_str,
            "parity_bit": parity_bit,
            "transmitted": transmitted_data,
            "type": parity_type,
            "message": f"Parity bit generated for {parity_type} parity."
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Running on port 5000 in debug mode for development
    app.run(debug=True, port=5000)
