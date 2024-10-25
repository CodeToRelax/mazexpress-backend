import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ShipmentsCollection from '@/models/shipments.model';
import UserCollection from '@/models/user.model';

const getShipmentCountByStatus = async () => {
  try {
    const results = await ShipmentsCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalWeight: { $sum: '$size.weight' },
        },
      },
    ]);

    const response = {
      total: {
        count: 0,
        weight: 0,
      },
      receivedAtWarehouse: {
        count: 0,
        weight: 0,
      },
      shippedToDestination: {
        count: 0,
        weight: 0,
      },
      readyForPickUp: {
        count: 0,
        weight: 0,
      },
    };

    results.forEach((result) => {
      switch (result._id) {
        case 'received at warehouse':
          response.receivedAtWarehouse.count = result.count;
          response.receivedAtWarehouse.weight = result.totalWeight;
          break;
        case 'shipped to destination':
          response.shippedToDestination.count = result.count;
          response.shippedToDestination.weight = result.totalWeight;
          break;
        case 'ready for pick up':
          response.readyForPickUp.count = result.count;
          response.readyForPickUp.weight = result.totalWeight;
          break;
        case 'delivered':
          response.total.count = result.count;
          response.total.weight = result.totalWeight;
          break;
      }
    });

    return response;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
  }
};

const getUserAndShipmentCountPerYear = async (year: string) => {
  try {
    const result = {
      year,
      monthlyCounts: [],
    };

    // Loop through each month of the year
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(Date.UTC(parseInt(year, 10), month, 1));
      const endDate = new Date(Date.UTC(parseInt(year, 10), month + 1, 0, 23, 59, 59, 999));

      // Count users created in the specified month
      const userCount = await UserCollection.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      // Count shipments created in the specified month
      const shipmentCount = await ShipmentsCollection.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      result.monthlyCounts.push({
        month: month + 1, // January is 1, December is 12
        userCount,
        shipmentCount,
      });
    }

    return result;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
  }
};

const getOrdersPerDay = async (day: string) => {
  try {
    const [dd, mm, yyyy] = day.split('/');

    const startDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    const endDate = new Date(`${yyyy}-${mm}-${dd}T23:59:59Z`);

    // Find shipments created on this day
    const shipments = await ShipmentsCollection.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return {
      date: day,
      count: shipments,
    };
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
  }
};

export const DashboardController = {
  getShipmentCountByStatus,
  getUserAndShipmentCountPerYear,
  getOrdersPerDay,
};
