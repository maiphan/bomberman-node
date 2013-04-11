var should = require('chai').should();
var Client = require("../");

describe("Client", function() {
    describe("create", function() {
        before(function() {
            this.testKey = "foobar";
        });

        it("should be assigned a key", function() {
            var client = Client(this.testKey);
            return client.key.should.be.ok;
        });

        it("should have default values", function() {
            var client = Client(this.testKey);
            var res = client.apiVersion.should.be.ok;
            res = client.useHttps.should.be.ok;
            res = client.hostName.should.be.ok;
        });

        it("should allow the user to specify defaults", function() {
            var testDefaults = {
                apiVersion: 2,
                hostName: "foobar.herokuapp.com"
            };

            var client = Client(this.testKey, testDefaults);
            var res = client.apiVersion.should.equal(testDefaults.apiVersion);
            res = client.hostName.should.equal(testDefaults.hostName);
        });
    });

    describe("_makePath", function() {
        beforeEach(function() {
            this.client = Client("foobar");
        });

        it("should create a default path if no language is provided", function() {
            var path = this.client._makePath("testPath");
            path.should.equal("/v" + this.client.apiVersion + "/testPath");
        });

        it("should not insert a slash if one is prepended", function() {
            var path = this.client._makePath("/testPath");
            path.should.equal("/v" + this.client.apiVersion + "/testPath");
        });

        it("should create a ja path if the Japanese language code is provided", function() {
            var path = this.client._makePath("testPath", "ja");
            path.should.equal("/ja/v" + this.client.apiVersion + "/testPath");
        });

        it("should throw an error if an incorrect language is provided", function() {
            // Wrap in a function so that we can test it.
            var c = this.client;
            var testFunc = function() {
                return c._makePath("testPath", "foo");
            };
            testFunc.should.throws(Error, /Unsupported/);
        });
    });
});
