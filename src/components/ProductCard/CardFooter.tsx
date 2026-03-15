import StoreIcon from "@/components/StoreIcon";
import { Product } from "@/typings";
import { getStoreEnum, Store } from "@/lib/utils";

interface Props {
  product: Product;
  padding?: number;
}

export default function CardFooter({ product, padding = 1.5 }: Props) {
  const store = getStoreEnum(product);

  const storeSpecificFooter = () => {
    switch (store) {
      case Store.Countdown:
        return (
          <div
            className={
              "source-site-footer text-white bg-green-700/70 p-" + padding
            }
          >
            <StoreIcon store={store} width={17} />
            Woolworths
          </div>
        );
      case Store.Warehouse:
        return (
          <div
            className={
              "source-site-footer text-white bg-red-700/60 p-" + padding
            }
          >
            <StoreIcon store={store} />
            The Warehouse
          </div>
        );
      case Store.Paknsave:
        return (
          <div
            className={
              "source-site-footer text-black bg-yellow-300/80 p-" + padding
            }
          >
            <StoreIcon store={store} />
            {"PAK'nSAVE"}
          </div>
        );
      case Store.NewWorld:
        return (
          <div
            className={
              "source-site-footer text-white bg-gray-600/80 p-" + padding
            }
          >
            <StoreIcon store={store} width={22} />
            New World
          </div>
        );

      default:
        return (
          <div
            className={
              "source-site-footer text-white bg-purple-700/80 p-" + padding
            }
          >
            {product.sourceSite}
          </div>
        );
    }
  };

  return (
    <div className={"text-sm text-center mt-2"}>{storeSpecificFooter()}</div>
  );
}
