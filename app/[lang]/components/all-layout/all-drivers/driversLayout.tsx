export default function AllDriversLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
        <div className="container mx-auto xl:px-24 lg:px-16 px-10">
          {children}
        </div>
    )
}