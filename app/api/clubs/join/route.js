import PocketBase from "pocketbase";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function POST(req) {
    try {
        await pb.admins.authWithPassword(
            process.env.POCKETBASE_AUTH_EMAIL, 
            process.env.POCKETBASE_AUTH_PASS
        );

        const session = await getServerSession(authOptions);
        
        if (!session || !session.userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const userId = session.userId;
        const { clubId } = await req.json();
        
        if (!clubId) {
            return new Response(JSON.stringify({ error: "Missing clubId" }), { status: 400 });
        }

        // Find the user by guser_id
        const user = await pb.collection("accounts").getFirstListItem(`guser_id="${userId}"`);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Fetch the current club
        const club = await pb.collection("clubs").getOne(clubId);

        // Check if user is already a member
        const existingMembers = club.members || [];
        if (existingMembers.includes(user.id)) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Already a member" 
            }), { status: 200 });
        }

        // Update club's members relation
        const updatedClub = await pb.collection("clubs").update(clubId, {
            members: [...existingMembers, user.id]
        });

        return new Response(JSON.stringify({ 
            success: true, 
            club: updatedClub 
        }), { status: 200 });
    } catch (error) {
        console.error("Error joining club:", error);
        return new Response(JSON.stringify({ 
            error: "Internal Server Error", 
            details: error.message 
        }), { status: 500 });
    }
}