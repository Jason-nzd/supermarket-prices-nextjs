import StoreIcon from "components/StoreIcon";
import { Product } from "../../typings";
import { getStoreEnum, Store } from "utilities/utilities";

interface Props {
  product: Product;
  iconSize: number;
}

export default function CardFooter({ product, iconSize = 20 }: Props) {
  const store = getStoreEnum(product);

  const storeSpecificFooter = () => {
    switch (store) {
      case Store.Countdown:
        return (
          <div className="source-site-footer text-white bg-green-700/80">
            <StoreIcon store={store} width={iconSize} />
            Woolworths
          </div>
        );
      case Store.Warehouse:
        return (
          <div className="source-site-footer text-white bg-red-700/80">
            <StoreIcon store={store} width={iconSize} />
            The Warehouse
          </div>
        );
      case Store.Paknsave:
        return (
          <div className="source-site-footer text-black bg-yellow-300/80">
            <StoreIcon store={store} width={iconSize} />
            {"PAK'nSAVE"}
          </div>
        );
      case Store.NewWorld:
        return (
          <div className="source-site-footer text-white bg-gray-600/80">
            <StoreIcon store={store} width={iconSize} />
            New World
          </div>
        );

      default:
        return (
          <div className="source-site-footer text-white bg-purple-700/80">
            {product.sourceSite}
          </div>
        );
    }
  };

  return (
    <div className={"text-sm text-center mt-2"}>{storeSpecificFooter()}</div>
  );
}
