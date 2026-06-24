import axios from 'axios';

/**
 * Fetch real-time data from a ThingSpeak public channel
 * @param {string|number} channelId 
 * @returns Structured data object
 */
export const fetchChannelData = async (channelId) => {
  try {
    const response = await axios.get(
      `https://api.thingspeak.com/channels/${channelId}/feeds.json?results=20`
    );
    
    const feeds = response.data.feeds;
    
    if (!feeds || feeds.length === 0) {
      return null;
    }

    const latest = feeds[feeds.length - 1];

    return {
      accuracy: Number(latest.field1) || 0,
      rul: Number(latest.field2) || 0,
      health: Number(latest.field3) || 0,
      fault: Number(latest.field4) || 0,
      history: feeds
    };
  } catch (error) {
    console.error(`Error fetching data for channel ${channelId}:`, error);
    throw error;
  }
};
