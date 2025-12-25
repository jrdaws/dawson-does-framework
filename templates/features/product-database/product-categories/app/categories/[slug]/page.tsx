import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getChildCategories,
  getProductsByCategory,
  getCategoryBreadcrumbs,
} from "@/lib/data/categories";
import { CategoryNav, CategoryBreadcrumbs } from "@/components/navigation/CategoryNav";

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const [children, products, breadcrumbs] = await Promise.all([
    getChildCategories(category.id),
    getProductsByCategory(category.id),
    getCategoryBreadcrumbs(category.id),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <CategoryBreadcrumbs breadcrumbs={breadcrumbs} className="mb-6" />

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {category.description}
          </p>
        )}
        {category.productCount !== undefined && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {category.productCount} products
          </p>
        )}
      </div>

      {/* Subcategories */}
      {children.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Subcategories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/categories/${child.slug}`}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium dark:text-white">{child.name}</h3>
                {child.productCount !== undefined && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {child.productCount} products
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Products in {category.name}
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 py-8 text-center">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3" />
                <h3 className="font-medium dark:text-white truncate">
                  {product.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} - Shop by Category`,
    description: category.description || `Browse ${category.name} products`,
  };
}

