import React, { useEffect, useState } from "react";
import "./index.css";
import Navbar from "./../../components/Navbar";
import Footer from "./../../components/Footer";
import { Card } from "./../../components/Card";
import { FaWhatsapp } from "react-icons/fa";
import AOS from "aos";
import { ProductType } from "../../components/Forms/Product/CreateOrEdit";
import api, { authorization } from "../../services/api";
import { VscLoading as LoadingIcon, IoMdSad } from "react-icons/all";
import { CategoryType } from "../../components/Forms/Category/CreateOrEdit";
AOS.init();

const Home = () => {
  const RemoveUndefined = (obj: any) => Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {})

  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ category?: string, search?: string }>({ category: "", search: "" })


  const [products, setProducts] = useState<ProductType[]>();
  const [categories, setCategories] = useState<CategoryType[]>([]);


  const HandleLoadProducts = async () => {
    if (productsLoading) return false
    setProductsLoading(true);
    try {
      var params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category)
      if (filters.search) params.append("search", filters.search)

      // Get the products in the database
      await api.get(`/products/list?${params.toString()}`).then(resp => {
        setProducts(resp.data.products)
      })
    } finally {
      setProductsLoading(false)
    }
  };


  const HandleLoadCategories = async () => {
    if (categoriesLoading) return false
    setCategoriesLoading(true);
    // Load the categories that will show in the category select input
    try {
      await api.get("/categories/list").then(resp => {
        setCategories(resp.data.categories)
      })
    } finally {
      setCategoriesLoading(false)
    }
  };


  useEffect(() => {
    HandleLoadProducts();
    HandleLoadCategories();
  }, []);

  return (
    <>
      <div
        className="w-full bg-no-repeat min-h-screen sm:min-h-0 bg-fixed"
        style={{
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "auto 100vh",
        }}
      >
        <div
          className="min-h-screen sm:min-h-0 bg-no-repeat bg-full bg-contain"
          style={{
            background:
              "linear-gradient(-207deg, rgba(142,96,11,0.7) 0%, rgba(0,0,0,0.85) 100%)",
          }}
        >
          <Navbar />
          <div className="container mx-auto z-10" style={{ minHeight: "27em" }}>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              className="pt-12 p-4"
              style={{ maxWidth: "650px" }}
            >
              <h1 style={{ color: "#facc3a" }} className="text-4xl font-ubuntu">
                O seu restaurante favorito agora presente na sua tela.
              </h1>
              <p className="pt-4 text-white text-lg">
                O Barbina está localizado no centro turístico de Barra Bonita,
                servindo deliciosos pratos e porções, chopp Brotas Beer,
                cervejas e drinks!
              </p>
              <hr className="mt-4" />
              <button className="contact-button text-barbina-brown mt-8 duration-300 flex gap-2 items-center py-1 px-4 ease-out rounded">
                <span>
                  <FaWhatsapp />
                </span>
                <span> Entre em contato</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="cardapio" className="container mx-auto">
        <h2 className="text-4xl text-barbina-brown font-ubuntu font-semibold my-8 text-center title-underline">
          Cardápio
        </h2>
        <div className="mt-2 py-4 px-2 mx-2 pb-8 bg-white border border-barbina-brown rounded-lg shadow-sm">
          <form onSubmit={e => { e.preventDefault(); HandleLoadProducts() }} className="sm:flex mb-4">
            <button type="submit" className="w-full sm:w-auto sm:mx-2 bg-yellow-400 duration-300 hover:bg-yellow-500 text-barbina-brown h-10 py-2 px-6 rounded cursor-pointer">
              Procurar
            </button>
            <div className="w-full my-2 sm:my-0 sm:w-40 h-10 p-1 flex border border-barbina-brown rounded">
              <select onChange={e => setFilters({ category: e.target.value, search: filters?.search })} className="mx-2 text-barbina-light-brown form-select w-full">
                <option value="">Todas</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="w-full sm:mx-2">
              <div className="p-1 flex border border-barbina-brown rounded">
                <input
                  placeholder="Procurar"
                  value={filters?.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                  className="p-1 px-2 w-full text-barbina-light-brown appearance-none outline-none"
                />
              </div>
            </div>
          </form>
          <hr className="border-barbina-brown" />
          <div className="grid grid-cols-5 content-center gap-2 px-2">
            <div className="sm:col-span-5"></div>
            {productsLoading ? (
              <span className="col-span-5 w-full justify-center text-barbina-brown py-40 flex items-center text-xl gap-2">Carregando
                <LoadingIcon className="rotate" />
              </span>
            ) : !products || products?.length <= 0 ?
              <span className="col-span-5 w-full justify-center text-barbina-brown py-40 flex items-center text-xl gap-2">Sem resultados encontrados
                <IoMdSad />
              </span>
              :
              products.map(product => {
                return (
                  <Card key={product._id} product={product} />
                )
              })
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
