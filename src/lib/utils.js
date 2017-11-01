/**
 * This file contains all global functions
 */

 /**
 * Helper function for escaping input strings
 */
export const htmlEntities = str => {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
