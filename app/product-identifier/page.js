import ProductIdentifier from '@/components/ProductIdentifier';

export const metadata = {
  title: 'Product Identifier - Agri Connect',
  description: 'Identify agricultural products and get detailed information in your language',
};

export default function ProductIdentifierPage() {
  return (
    <div className="container mx-auto py-8">
      <ProductIdentifier />
    </div>
  );
} 