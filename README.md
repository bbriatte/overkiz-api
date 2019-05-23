# overkiz-api

[![npm version](https://badge.fury.io/js/overkiz-api.svg)](https://badge.fury.io/js/overkiz-api)

overkiz-api is a Node.js library that implements the Overkiz IoT API

## Installation
`npm install --save overkiz-api`

## Some usage

Retrieves all house 

```typescript
async function fetchAllHouse(): Promise<Setup> {
    const api: API = new API({
        host: 'ha110-1.overkiz.com', // Cozytouch host
        user: 'XXX', // your user account
        password: 'XXX', // your password
        polling: {
            always: false,
            interval: 1000
        }
    });
    return api.getSetup();
}
// Execute the task
fetchAllHouse()
    .then(console.log)
    .catch(console.error)
```

Get all devices of type 'WaterHeatingSystem'

```typescript
async function getAllWaterHeatingSystem(): Promise<APIDevice[]> {
    const api: API = new API({
        host: 'ha110-1.overkiz.com', // Cozytouch host
        user: 'XXX', // your user account
        password: 'XXX', // your password
        polling: {
            always: false,
            interval: 1000
        } 
    });
    const devices: APIDevice[] = await api.getDevices();
    return devices.filter((d) => d.uiClass === 'WaterHeatingSystem');
}
// Execute the task
getAllWaterHeatingSystem()
    .then(console.log)
    .catch(console.error)
```

Change device name

```typescript
async function changeName(): Promise<boolean> {
    const devices: APIDevice[] = await getAllWaterHeatingSystem(); // call the previous function
    const device = devices.find((d) => d.hasCommand('setName'));
    if(device !== undefined) {
        return device.exec({
            name: 'setName',
            parameters: [
                'HelloWorld'
            ]
        });
    }
    return false;
}
// Execute the task
changeName()
    .then(console.log)
    .catch(console.error)
```