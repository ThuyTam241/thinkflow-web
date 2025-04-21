import Skeleton from "react-loading-skeleton";

const TableSkeleton = ({ columnCount }) => (
  <div className="flex h-full flex-col space-y-10 px-10">
    <table className="w-full border-collapse">
      <thead className="border-gallery border-b text-left">
        <tr>
          {[...Array(columnCount)].map((_, index) => (
            <th
              key={index}
              className="text-ebony-clay font-body px-5 py-4 text-sm font-bold uppercase"
            >
              <Skeleton width={100} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-gallery divide-y">
        {[...Array(5)].map((_, rowIndex) => (
          <tr key={rowIndex} className="odd:bg-hawkes-blue/15">
            {[...Array(columnCount)].map((_, cellIndex) => (
              <td
                key={cellIndex}
                className="font-body text-silver-chalice p-5 text-base"
              >
                <Skeleton width={200} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableSkeleton;
