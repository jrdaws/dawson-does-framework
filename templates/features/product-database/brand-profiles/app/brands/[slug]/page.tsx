import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBrandBySlug, getProductsByBrand } from "@/lib/data/brands";

interface BrandPageProps {
  params: { slug: string };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const brand = await getBrandBySlug(params.slug);

  if (!brand) {
    notFound();
  }

  const products = await getProductsByBrand(brand.id, 12);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="flex items-start gap-6 mb-8">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
            {brand.name[0]}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold dark:text-white">{brand.name}</h1>
            {brand.verified && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                ✓ Verified
              </span>
            )}
          </div>

          {brand.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
              {brand.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {brand.founded && <span>Founded: {brand.founded}</span>}
            {brand.headquarters && <span>📍 {brand.headquarters}</span>}
            {brand.productCount !== undefined && (
              <span>{brand.productCount} products</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>

      {/* Social Links */}
      {brand.socialLinks && Object.keys(brand.socialLinks).length > 0 && (
        <div className="flex gap-4 mb-8">
          {brand.socialLinks.twitter && (
            <SocialLink href={brand.socialLinks.twitter} label="Twitter" />
          )}
          {brand.socialLinks.instagram && (
            <SocialLink href={brand.socialLinks.instagram} label="Instagram" />
          )}
          {brand.socialLinks.facebook && (
            <SocialLink href={brand.socialLinks.facebook} label="Facebook" />
          )}
          {brand.socialLinks.linkedin && (
            <SocialLink href={brand.socialLinks.linkedin} label="LinkedIn" />
          )}
        </div>
      )}

      {/* Products */}
      <section>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Products from {brand.name}
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No products found for this brand.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium dark:text-white truncate">
                  {product.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400">
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

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
    >
      {label}
    </a>
  );
}

export async function generateMetadata({ params }: BrandPageProps) {
  const brand = await getBrandBySlug(params.slug);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  return {
    title: `${brand.name} - Brand Profile`,
    description: brand.description || `View products from ${brand.name}`,
  };
}

