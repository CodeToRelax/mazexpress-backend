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
        },
      },
    ]);

    const response = {
      total: 0,
      receivedAtWarehouse: 0,
      shippedToDestination: 0,
      readyForPickUp: 0,
      delivered: 0,
    };

    results.forEach((result) => {
      response.total += result.count;
      switch (result._id) {
        case 'received at warehouse':
          response.receivedAtWarehouse = result.count;
          break;
        case 'shipped to destination':
          response.shippedToDestination = result.count;
          break;
        case 'ready for pick up':
          response.readyForPickUp = result.count;
          break;
        case 'delivered':
          response.delivered = result.count;
          break;
        default:
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
