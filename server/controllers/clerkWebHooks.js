import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        console.log("🔹 Incoming Clerk webhook request");
        console.log("Headers:", req.headers);
        console.log("Body:", JSON.stringify(req.body, null, 2));

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        console.log("🔹 Verifying webhook signature...");
        await whook.verify(JSON.stringify(req.body), headers);
        console.log("✅ Webhook signature verified");

        const { data, type } = req.body;
        console.log("🔹 Event type:", type);
        console.log("🔹 Event data:", data);

        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address,
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url,
        };

        console.log("🔹 Prepared user data for DB:", userData);

        switch (type) {
            case "user.created": {
                console.log("📌 Creating user in DB...");
                await User.create(userData);
                console.log("✅ User created successfully");
                break;
            }

            case "user.updated": {
                console.log("📌 Updating user in DB...");
                await User.findByIdAndUpdate(data.id, userData);
                console.log("✅ User updated successfully");
                break;
            }

            case "user.deleted": {
                console.log("📌 Deleting user from DB...");
                await User.findByIdAndDelete(data.id);
                console.log("✅ User deleted successfully");
                break;
            }

            default:
                console.log("⚠️ Unhandled event type:", type);
                break;
        }

        res.json({ success: true, message: "Webhook Received" });
    } catch (error) {
        console.log("❌ Error in webhook handler:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
