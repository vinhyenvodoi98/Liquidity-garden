import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://api.blockeden.xyz/sui-indexer/${process.env.NEXT_PUBLIC_BLOCKEDEN_API}`,
  timeout: 5000, // Timeout if necessary
});


export const fetchData = async ( url:string , options = {}) => {
  try {
    const response = await axiosInstance(url, options);
    return response.data;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw new Error('Could not get data');
  }
};

export async function fetchCoins(account:string) {
  try {
    var options = {
      method: 'GET',
      params: { account: account }
    };
    const data = await fetchData('/account/coins', options);
    return data
  } catch (error) {
    return error;
  }
}
