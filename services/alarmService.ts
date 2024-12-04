export async function createNotification(title: string, message: string, sendResponse: (response: any) => void) {
  try {
    const notificationId = await new Promise<string>((resolve, reject) => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon/32.png',
        title,
        message,
        requireInteraction: true,
        priority: 2
      }, (notificationId) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(notificationId);
      });
    });

    sendResponse({
      success: true,
      data: notificationId,
      error: null
    });
  }
  catch (e) {
    console.log(e);
    sendResponse({
      success: false,
      data: null,
      error: e
    });
  }
}

export async function createAlarm(name: string, options: any, sendResponse: (response: any) => void) {
  try {
    await new Promise<void>((resolve, reject) => {
      chrome.alarms.create(name, options, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });

    sendResponse({
      success: true,
      data: null,
      error: null
    });
  }
  catch (e) {
    console.log(e);
    sendResponse({
      success: false,
      data: null,
      error: e
    });
  }
}

export async function clearAlarm(name: string, sendResponse: (response: any) => void) {
  try {
    const alarms = await new Promise<chrome.alarms.Alarm[]>((resolve, reject) => {
      chrome.alarms.getAll((alarms) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(alarms);
      });
    });

    if (!alarms.find((a) => a.name === name)) {
      sendResponse({
        success: true,
        data: 'Alarm not found',
        error: null
      });
    }

    const wasCleared = await new Promise<boolean>((resolve) => {
      chrome.alarms.clear(name, (wasCleared) => {
        resolve(wasCleared);
      });
    });

    if (!wasCleared) {
      throw new Error('Alarm not cleared');
    }

    sendResponse({
      success: true,
      data: 'Alarm cleared',
      error: null
    });
  }
  catch (e) {
    console.log(e);
    sendResponse({
      success: false,
      data: null,
      error: e
    });
  }
}

export async function getAlarm(name: string, sendResponse: (response: any) => void) {
  try {
    const alarm = await new Promise<chrome.alarms.Alarm | null>((resolve, reject) => {
      chrome.alarms.get(name, (alarm) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(alarm);
      });
    });

    sendResponse({
      success: true,
      data: alarm,
      error: null
    });
  }
  catch (e) {
    console.log(e);
    sendResponse({
      success: false,
      data: null,
      error: e
    });
  }
}

export async function getAllAlarm(sendResponse: (response: any) => void) {
  try {
    const alarms = await new Promise<chrome.alarms.Alarm[]>((resolve, reject) => {
      chrome.alarms.getAll((alarms) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(alarms);
      });
    });

    sendResponse({
      success: true,
      data: alarms,
      error: null
    });
  }
  catch (e) {
    console.log(e);
    sendResponse({
      success: false,
      data: null,
      error: e
    });
  }
}