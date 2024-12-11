import { useEffect, useState } from "react";

export const CurrencyConverter = () => {
  const [currencyData, setCurrencyData] = useState({ conversion_rates: {} });
  const [amountData, setAmountData] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [fromData, setFromData] = useState('USD');
  const [toData, setToData] = useState('AFN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get API key from environment variables
  const My_Key = import.meta.env.VITE_API_KEY;

  // Fetch currency data whenever fromData or My_Key changes
  useEffect(() => {
    const handleData = async () => {
      setLoading(true);  // Set loading to true when the API call starts
      setError(null);  // Reset any previous errors

      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${My_Key}/latest/${fromData}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API.");
        }
        
        const data = await response.json();
        
        // Ensure we have the expected data
        if (data?.conversion_rates) {
          setCurrencyData(data);
        } else {
          throw new Error("Invalid response format.");
        }
      } catch (err) {
        setError(err.message);  // Display error message if something goes wrong
      } finally {
        setLoading(false);  // Set loading to false when the API call ends
      }
    };

    handleData();
  }, [fromData, My_Key]);  // Re-run effect if 'fromData' or 'My_Key' changes

  const handleConversion = () => {
    // Ensure the amount is a valid number
    const numericAmount = parseFloat(amountData);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // Check if conversion rates are available
    if (currencyData?.conversion_rates && currencyData.conversion_rates[toData]) {
      const rate = currencyData.conversion_rates[toData];
      setConvertedAmount(numericAmount * rate);
    } else {
      alert("Conversion rate not available.");
    }
  };

  return (
    <div className="bg-gradient-to-tr from-pink-300 to-purple-400 p-[15px] h-100vh">
      <div className="h-[500px] w-[400px] border-2 border-black m-auto rounded-3xl shadow-lg shadow-gray-600 p-[15px]">
        <h1 className="text-3xl text-center font-serif font-semibold">Currency Converter</h1>
        <div className="mt-[20px]">
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="amount" className="font-serif text-xl font-semibold text-black">
              Enter Amount:
            </label>
            <input
              type="text"
              id="amount"
              placeholder="Enter Amount Here"
              className="mt-[10px] w-full p-2 rounded-lg shadow-md shadow-gray-700 cursor-pointer outline-none"
              value={amountData}
              onChange={(e) => setAmountData(e.target.value)}
            />
            <br />
            <br />
            <div className="flex">
              <div>
                <label htmlFor="from" className="font-serif text-xl font-semibold text-black">
                  From:
                </label>
                <input
                  type="text"
                  className="p-1 w-[160px] outline-none shadow-md shadow-gray-700 rounded-md cursor-pointer"
                  id="from"
                  value={fromData}
                  onChange={(e) => setFromData(e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label htmlFor="to" className="font-serif text-xl font-semibold text-black">
                  To:
                </label>
                <input
                  type="text"
                  id="to"
                  className="p-1 w-[160px] outline-none shadow-md shadow-gray-700 rounded-md cursor-pointer"
                  value={toData}
                  onChange={(e) => setToData(e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <br />
            <button
              type="button"
              onClick={handleConversion}
              className="text-center bg-gradient-to-br from-yellow-400 to-red-500 w-full p-1 shadow-md shadow-gray-500 hover:scale-105 duration-500 font-serif font-bold text-white text-xl"
            >
              Get Exchange Rate
            </button>
          </form>
          
          {/* Loading Spinner */}
          {loading && <div className="text-center mt-4">Loading...</div>}

          {/* Error message */}
          {error && <div className="text-center mt-4 text-red-500">{error}</div>}

          {/* Display Converted Amount */}
          {convertedAmount !== null && !loading && !error && (
            <div className="mt-4 text-center">
              <h1 className="text-lg">Converted Amount:</h1>
              <h1 className="text-xl">{convertedAmount.toFixed(2)} {toData}</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
