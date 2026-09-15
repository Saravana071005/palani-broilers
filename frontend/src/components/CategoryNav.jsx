import { SlidersHorizontal } from 'lucide-react'

function CategoryNav({ categories, selectedCategory, onCategoryChange, productCounts = {} }) {
  const allCategories = [
    { id: 'all', name: 'All Products', tamilName: 'அனைத்தும்' },
    ...categories.map((c) => ({
      id: c.slug || c._id,
      name: c.name,
      tamilName: c.nameTamil || c.name,
    }))
  ]

  return (
    <nav className="category-bar-wrapper" aria-label="Product categories">
      <div className="category-rail" role="tablist">
        <div className="flex items-center text-forest pl-1 pr-2" aria-hidden="true">
          <SlidersHorizontal size={15} />
        </div>
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat.id
          const count = productCounts[cat.id]
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`category-pill ${isActive ? 'is-active' : ''}`}
            >
              <span>{cat.name}</span>
              {count !== undefined && count > 0 && (
                <span className="count">({count})</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryNav
