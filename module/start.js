const { reductionCategoryZakaji } = require('../module/categoryZakaji');
const { reductionSubCategoryZakaji } = require('../module/subCategoryZakaji');
const { createAdmin } = require('../module/user');
const { Worker, isMainThread } = require('worker_threads');

let startDeleteBD = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/deleteBD.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('DeleteBD: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`DeleteBD stopped with exit code ${code}`))
        });
        console.log('DeleteBD '+w.threadId+ ' run')
    }
}

let startResetUnloading = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/resetUnloading.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('ResetUnloading: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`ResetUnloading stopped with exit code ${code}`))
        });
        console.log('ResetUnloading '+w.threadId+ ' run')
    }
}

let startOutXMLShoroZakaji = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/singleOutXMLZakaji.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('SingleOutXMLZakaji: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`SingleOutXMLZakaji stopped with exit code ${code}`))
        });
        console.log('SingleOutXMLZakaji '+w.threadId+ ' run')
    }
}

let startReminderClient = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/reminderClient.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('ReminderClient: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`ReminderClient stopped with exit code ${code}`))
        });
        console.log('ReminderClient '+w.threadId+ ' run')
    }
}

let start = async () => {
    await createAdmin();
    await startResetUnloading()
    await startReminderClient();
    await startOutXMLShoroZakaji();
    await startDeleteBD();
    await reductionCategoryZakaji()
    await reductionSubCategoryZakaji()
}

module.exports.start = start;
