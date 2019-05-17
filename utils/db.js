const logger = require('./logger');

class Storage {

    constructor() {
        this.data = [];
    }

    findById(id) {
        return this.data.find(el => el.id === id);
    }

    find() {
        return this.data;
    }

    insertOrUpdate(el) {
        let updated = false;

        this.data.forEach((_el, i)=> {
           if(_el.id === el.id) {
               //logger.debug("Element updated");
               this.data[i] = el;
               updated = true;
           }
        });

        if(!updated) {
            this.data.push(el);
            //logger.debug("Element inserted");
        }
    }

}

module.exports = new Storage();