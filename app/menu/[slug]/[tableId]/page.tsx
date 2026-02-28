import CustomerMenu from '@/components/menu/CustomerMenu'

export default function TableMenuPage({
  params,
}: {
  params: { slug: string; tableId: string }
}) {
  return <CustomerMenu slug={params.slug} tableId={params.tableId} />
}
