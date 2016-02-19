module.exports = {
    metadata: {
        family: 'pHMeter',
        plugin: 'pHMeter',
        label: 'Atlas Scientific pH Meter',
        manufacturer: 'Atlas Scientific',
        discoverable: false,
        tangible: true,
        additionalSoftware: [],
        actorTypes: [],
        sensorTypes: [],
        state: [{
            id: "pHValue",
            label: "pH Value",
            type: {
                id: "decimal"
            }
        }],
        services: [],
        configuration: []
    },
    create: function () {
        return new pHMeter();
    },
    discovery: function () {
        return null;
    }
};

var q = require('q');
var _ = require('lodash');

/**
 *
 * @constructor
 */
function pHMeter() {
    /**
     *
     */
    pHMeter.prototype.start = function () {
        var deferred = q.defer();

        this.state = {pHValue: 6.0};

        if (this.isSimulated()) {
            this.interval = setInterval(function () {
                this.state.pHValue = 5 + 0.1 * new Date().getTime() % 2;

                this.publishStateChange();
            }.bind(this), 20000);

            deferred.resolve();
        } else {
            if (!this.serialport) {
                this.serialport = require('serialport');
            }

            // Clear serial buffer

            this.serialport.write("\r");

            // Turn on LEDS

            this.serialport.write("L,1\r");

            // Enable streaming

            this.serialport.write("C,1\r");

            this.serialPort.on("data", function (data) {
                console.log(data);
            });

            deferred.resolve();
        }

        return deferred.promise;
    };

    /**
     *
     */
    pHMeter.prototype.stop = function () {
        var deferred = q.defer();

        if (this.isSimulated()) {
            if (this.interval) {
                clearInterval(this.interval);
            }
        } else {
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    pHMeter.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    pHMeter.prototype.setState = function () {
    };
}
