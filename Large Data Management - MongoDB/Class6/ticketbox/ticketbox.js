// Data structure
// Events collection
[{
    "_id": ObjectId("..."), // Unique identifier for the event
    "event_name": "String", // Name of the event
    "event_date": "Date", // Date of the event
    "location": "String", // Location of the event
    "ticket_tiers": [ // Array of ticket tiers available for the event
        {
            "tier": "String", // Name of the ticket tier
            "price": "Number" // Price of the ticket tier
        },
    ],
    "description": "String" // Description of the event
}]

// Tickets collection
[{
    "_id": ObjectId("..."), // Unique identifier for the ticket
    "event_id": ObjectId("..."), // Event ID the ticket is for
    "customer_name": "String", // Name of the customer who purchased the ticket
    "email": "String", // Email of the customer who purchased the ticket
    "ticket_tier": "String", // Tier of the ticket purchased
    "purchase_date": "Date" // Date the ticket was purchased
}]

// Customers collection
[{
    "_id": ObjectId("..."), // Unique identifier for the customer
    "name": "String", // Customer's name
    "email": "String", // Customer's email
    "phone_number": "String", // Customer's phone number
    "purchased_tickets": ["ObjectId"] // Array of ticket IDs purchased by the customer
}]

// List of upcoming events
db.createView(
	"upcoming_events",
	"events",
	[
		{ $addFields: { convertedDate: { $dateFromString: { dateString: "$date" } } } },
		{ $match: { convertedDate: { $gte: new Date() } } },
        {
            $project: {
                _id: 0,
                event_name: 1,
                event_type: 1,
                location: 1,
                venue: 1,
                date: 1,
                time: 1,
                total_tickets: { $sum: "$ticket_tiers.available_tickets" }
            }
        }
    ]
)


// Events revenue
db.createView(
    "event_revenue",
    "tickets",
    [
        {
            $lookup: {
                from: "events",
                localField: "event_id",
                foreignField: "_id",
                as: "event_details"
            }
        },
        { $unwind: "$event_details" },
        {
            $addFields: {
                tier_price: {
                    // get the first element from the filtered array -> get the right tier
                    // $arrayElemAt: [ <array>, <index> ] -> get the <index> element from the <array>
                    $arrayElemAt: [{
                        // $filter: create a new array containing only the elements that match the 'cond' condition
                        $filter: {
                            input: "$event_details.ticket_tiers",
                            as: "tier",
                            cond: { $eq: ["$$tier.tier", "$ticket_tier"] }
                        }
                    }, 0]
                }
            }
        },
        {
            $group: {
                _id: "$event_id",
                total_revenue: { $sum: "$tier_price.price" },
                tickets_sold: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "events",
                localField: "_id",
                foreignField: "_id",
                as: "event_details"
            }
        },
        {
            $project: {
                _id: 0,
                event_name: { $arrayElemAt: ["$event_details.event_name", 0] },
                total_revenue: "$total_revenue",
                            tickets_sold: "$tickets_sold"
            }
        },
        { $sort: { total_revenue: -1 } }
    ]
);


// Customer purchase
db.createView(
    "customer_purchases",
    "customers",
    [
        {
            $lookup: {
                from: "tickets",
                localField: "purchased_tickets",
                foreignField: "_id",
                as: "ticket_details"
            }
        },
        { $unwind: "$ticket_details" },
        {
            $lookup: {
                from: "events",
                localField: "ticket_details.event_id",
                foreignField: "_id",
                as: "event_details"
            }
        },
        { $unwind: "$event_details" },
        {
            $project: {
                customer_name: "$name",
                email: 1,
                event_name: "$event_details.event_name",
                ticket_tier: "$ticket_details.ticket_tier",
                purchase_date: "$ticket_details.purchase_date"
            }
        }
    ]
)

// Tickets sold by each event type
db.createView(
    "event_type_sold",
    "tickets",
    [
        {
            $lookup: {
                from: "events",
                localField: "event_id",
                foreignField: "_id",
                as: "event_details"
            }
        },
        { $unwind: "$event_details" },
        {
            $addFields: {
                tier_price: {
                    $arrayElemAt: [{
                        $filter: {
                            input: "$event_details.ticket_tiers",
                            as: "tier",
                            cond: { $eq: ["$$tier.tier", "$ticket_tier"] }
                        }
                    }, 0]
                }
            }
        },
        {
            $group: {
                _id: "$event_details.event_type",
                tickets_sold: { $sum: 1 },
                total_revenue: { $sum: "$tier_price.price" }
            }
        },
        { $sort: { tickets_sold: -1, total_revenue: -1 } }
    ]
)