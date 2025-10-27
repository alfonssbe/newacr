export default function AllProductLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
      <>
        <div className="bg-white w-full items-end justify-start">
          {children}
        </div>
      </>
    )
}