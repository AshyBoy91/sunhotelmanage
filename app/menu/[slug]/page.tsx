import CustomerMenu from '@/components/menu/CustomerMenu'

export default function MenuPage({ params }: { params: { slug: string } }) {
  return <CustomerMenu slug={params.slug} />
}
