export const formatPrice = (price: any) => {
  return new Intl.NumberFormat('id-ID').format(price)
}
