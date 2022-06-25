import axios from 'axios';

export const getBitCoin = async () => {
  try {
    const result = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_desc&per_page=100&page=1&sparkline=false',
    );
    return result.data;
  } catch (error) {
    return error;
  }
};
