import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";

import CreateOrEditProduct, { ProductType } from "../../../../components/Forms/Product/CreateOrEdit";
import AdminLayout from "../../../../layout/AdminLayout";

import api from "../../../../services/api";

import { VscLoading, IoMdSad } from "react-icons/all"

const Index = () => {
  const { id }: any = useParams();

  const [product, setProduct] = useState<ProductType>();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get the the data of product that will be edited
    setLoading(true)
    api.get(`/products?_id=${id}`).then(response => {
      setProduct(response.data.product)
      setLoading(false)
    })
  }, [id]);

  return (
    <>
      <AdminLayout>
        <div className="container mt-12 mx-auto">
          <span className="text-2xl w-full text-barbina-brown mx-6 px-2 add-product-title-underline">
            Editar {product?.name}
          </span>

          {
            //If is loading
            loading ? (
              <span className="w-full justify-center text-gray-600 py-40 flex items-center text-xl gap-2">
                Carregando <VscLoading className="rotate" />
              </span>
            ) :
              //If found the product or not
              !product ? (
                <span className="w-full justify-center text-gray-600 py-40 flex items-center text-xl gap-2">
                  Produto não encontrado <IoMdSad />
                </span>
              ) : (
                <CreateOrEditProduct datas={{ product }} />
              )}
        </div>
      </AdminLayout>
    </>
  );
};

export default Index;
