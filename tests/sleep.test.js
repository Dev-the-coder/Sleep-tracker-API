const request = require("supertest");
const app = require("../app");
const dbPromise = require("../database");


describe("Sleep API", () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.run("DELETE FROM sleep");
  });

  describe("POST /sleep", () => {
    it("should add a new sleep record", async () => {
      const sleepRecord = {
        userId: "user1",
        hours: 8.5,
        timestamp: "2023-01-01T00:00:00Z",
      };
      const response = await request(app).post("/sleep").send(sleepRecord);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Sleep record added successfully."
      );
    });

    it("should return an error if required fields are missing", async () => {
      const sleepRecord = {
        userId: "user1",
        hours: 8,
      };
      const response = await request(app).post("/sleep").send(sleepRecord);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Missing required fields: userId, hours, and timestamp."
      );
    });
  });

  describe("GET /sleep/:userId", () => {
    it("should retrieve all sleep records for a given user", async () => {
      const sleepRecord1 = {
        userId: "user1",
        hours: 8,
        timestamp: "2023-01-01T00:00:00Z",
      };
      const sleepRecord2 = {
        userId: "user1",
        hours: 7,
        timestamp: "2023-01-02T00:00:00Z",
      };
      const db = await dbPromise;
      await db.run(
        "INSERT INTO sleep (userId, hours, timestamp) VALUES (?, ?, ?)",
        [sleepRecord1.userId, sleepRecord1.hours, sleepRecord1.timestamp]
      );
      await db.run(
        "INSERT INTO sleep (userId, hours, timestamp) VALUES (?, ?, ?)",
        [sleepRecord2.userId, sleepRecord2.hours, sleepRecord2.timestamp]
      );

      const response = await request(app).get("/sleep/user1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Sleep records retrieved successfully."
      );
      expect(response.body.records).toBeInstanceOf(Array);
      expect(response.body.records).toHaveLength(2);
    });

    it("should return 404 if no sleep records are found for a given user", async () => {
      const response = await request(app).get("/sleep/nonexistentuser");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "No sleep records found for the given user."
      );
    });
  });

  describe("DELETE /sleep/:recordId", () => {
    it("should delete a specific sleep record by its ID", async () => {
      const sleepRecord = {
        userId: "user1",
        hours: 8,
        timestamp: "2023-01-01T00:00:00Z",
      };
      const db = await dbPromise;
      await db.run(
        "INSERT INTO sleep (userId, hours, timestamp) VALUES (?, ?, ?)",
        [sleepRecord.userId, sleepRecord.hours, sleepRecord.timestamp],
        function () {
          const recordId = this.lastID;
          request(app)
            .delete(`/sleep/${recordId}`)
            .end((err, res) => {
              expect(res.status).toBe(200);
              expect(res.body).toHaveProperty(
                "message",
                "Sleep record deleted successfully."
              );
              expect(res.body).toHaveProperty(
                "deletedRecordId",
                recordId.toString()
              );
            });
        }
      );
    });

    it("should return 404 if the sleep record is not found", async () => {
      const response = await request(app).delete("/sleep/999999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "Sleep record not found."
      );
    });
  });
});
