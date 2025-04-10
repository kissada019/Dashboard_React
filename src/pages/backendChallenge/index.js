import React, { useEffect, useState } from "react";
import Register from "../../modules/register";


function LayoutPage() {

    const input = [[59], [73, 41], [52, 40, 53], [26, 53, 6, 34]];

    const getMaxSum = (input) => {
        return input.reduce((sum, arr) => sum + Math.max(...arr), 0);
    };

    const result = getMaxSum(input);

    // ---------------------------------------------------------------------------------------

    const [inputNumber, setInputNumber] = useState('');
    const [encodedResult, setEncodedResult] = useState('');
    const [decodedResult, setDecodedResult] = useState('');

    const encodeNumber = (numberString) => {
        console.log("numberString : ", numberString);

        if (!numberString || numberString.length < 2) {
            return '';
        }

        let encoded = '';
        for (let i = 0; i < numberString.length; i++) {

            if (i == 0) {
                if (numberString[i] == 'L') {
                    encoded += '1';
                    encoded += '0';
                } else if (numberString[i] == 'R') {
                    encoded += '0';
                    encoded += '1';
                } else if (numberString[i] == '=') {
                    encoded += '0';
                    encoded += '0';


                }

            } else {
                if (numberString[i] == 'L') {
                    if (encoded[i] == 0) {
                        const array = encoded.split("");

                        for (let j = array.length - 1; j >= 0; j--) {
                            if (numberString[j] == 'L') {
                                const plus = parseInt(array[j]) + 1;
                                array[j] = plus;
                            }
                            if (numberString[j - 1] == '=') {

                                array[j - 1] = array[j];
                            }
                            if (numberString[j + 1] == '=') {
                                array[j + 1] = array[j];

                            }
                        }

                        encoded = array.join("");

                        // const test = parseInt(encoded[i]) - 1


                        const test = 0
                        encoded += test.toString();

                    } else {
                        // const test = parseInt(encoded[i]) - 1


                        const test = 0
                        encoded += test.toString();
                    }

                } else if (numberString[i] == 'R') {
                    const test = parseInt(encoded[i]) + 1
                    encoded += test.toString();

                } else if (numberString[i] == '=') {
                    encoded += encoded[i];
                }


            }



            // if (left > right) {
            //     encoded += 'L';
            // } else if (left < right) {
            //     encoded += 'R';
            // } else {
            //     encoded += '=';
            // }
        }
        return encoded;
    };

    const decodeNumber = (encodedString) => {
        console.log("encodedString : ", encodedString);

        if (!encodedString) {
            return '';
        }

        let minSum = Infinity;
        let minNumberString = '';

        const generateNumbers = (index, currentNumberString) => {
            if (index === encodedString.length) {
                const sum = currentNumberString.split('').reduce((acc, num) => acc + parseInt(num), 0);
                if (sum < minSum) {
                    minSum = sum;
                    minNumberString = currentNumberString;
                }
                return;
            }

            for (let i = 0; i <= 9; i++) {
                if (index === 0) {
                    generateNumbers(index + 1, String(i));
                } else {
                    const prev = parseInt(currentNumberString[index - 1]);
                    if (encodedString[index - 1] === 'L' && i < prev) {
                        generateNumbers(index + 1, currentNumberString + i);
                    } else if (encodedString[index - 1] === 'R' && i > prev) {
                        generateNumbers(index + 1, currentNumberString + i);
                    } else if (encodedString[index - 1] === '=' && i === prev) {
                        generateNumbers(index + 1, currentNumberString + i);
                    }
                }
            }
        };

        generateNumbers(0, '');
        return minNumberString;
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputNumber(value);
        setEncodedResult(encodeNumber(value));
    };





    return (
        <>
            <h1>Max Sum: {result}</h1>

            <div>
                <label>
                    Enter Number:
                    <input type="text" value={inputNumber} onChange={handleInputChange} />
                </label>
                <p>Encoded Result: {encodedResult}</p>

            </div>

        </>
    );
}

export default LayoutPage;
