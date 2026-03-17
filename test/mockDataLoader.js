import * as mockDataLoader from "../src/mockDataLoader.js";
import fs from "fs";
import path from "path";
import assert from "assert";

describe("mockDataLoader", () => {
    beforeEach(() => {
        mockDataLoader.reset();
    });

    it("buildMappings adds mapping for valid config", () => {
        const config = {
            request: { path: "/it", method: "POST" },
            response: { status: 201 }
        };
        mockDataLoader.buildMappings(config);
        const mappings = mockDataLoader.getRequestMappings();
        assert.strictEqual(mappings["/it"].length, 1);
        assert.strictEqual(mappings["/it"][0].request.method, "POST");
        assert.strictEqual(mappings["/it"][0].response.status, 201);
    });

    it("buildMappings does not add mapping for invalid config", () => {
        const config = { request: {}, response: {} };
        mockDataLoader.buildMappings(config);
        const mappings = mockDataLoader.getRequestMappings();
        assert.strictEqual(Object.keys(mappings).length, 0);
    });

    it("setDefaults sets default method and status", () => {
        const config = {
            request: { path: "/foo" },
            response: {}
        };
        mockDataLoader.buildMappings(config);
        const mappings = mockDataLoader.getRequestMappings();
        assert.strictEqual(mappings["/foo"][0].request.method, "GET");
        assert.strictEqual(mappings["/foo"][0].response.status, 200);
    });

    it("reset clears mappings", () => {
        const config = {
            request: { path: "/bar" },
            response: {}
        };
        mockDataLoader.buildMappings(config);
        mockDataLoader.reset();
        assert.strictEqual(Object.keys(mockDataLoader.getRequestMappings()).length, 0);
    });

    it("loadRequestMappings loads mappings from files", () => {
        // Create a temporary mock file
        const tempDir = path.join(__dirname, "mockdata");
        fs.mkdirSync(tempDir, { recursive: true });
        const mockFilePath = path.join(tempDir, "mock1.json");
        fs.writeFileSync(
            mockFilePath,
            JSON.stringify({
                request: { path: "/baz" },
                response: { status: 202 }
            })
        );

        mockDataLoader.reset();
        const mappings = mockDataLoader.loadRequestMappings(tempDir);
        assert.strictEqual(mappings["/baz"].length, 1);
        assert.strictEqual(mappings["/baz"][0].response.status, 202);

        // Cleanup
        fs.unlinkSync(mockFilePath);
        fs.rmdirSync(tempDir);
    });
});
