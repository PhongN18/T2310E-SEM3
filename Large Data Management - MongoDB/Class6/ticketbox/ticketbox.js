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


db.tickets.aggregate([
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
            total_revenue: { $sum: "$tier_price.price" }
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
            total_revenue: "$total_revenue"
        }
    },
    { $sort: { total_revenue: -1 } }
]);
