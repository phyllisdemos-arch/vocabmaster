import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>
  }
})

// Mock ClayCard component
jest.mock('@/components/ClayCard', () => {
  return function MockClayCard({ children, className }: any) {
    return <div className={className}>{children}</div>
  }
})

describe('Home Page', () => {
  it('renders page heading', () => {
    render(<Home />)

    expect(screen.getByText('选择学习单元')).toBeInTheDocument()
  })

  it('renders progress statistics', () => {
    render(<Home />)

    expect(screen.getByText(/25.*220.*个单词/)).toBeInTheDocument()
  })

  it('renders unit cards', () => {
    render(<Home />)

    // Check if some units are rendered
    expect(screen.getByText('Unit 1: Countries and nationalities')).toBeInTheDocument()
    expect(screen.getByText('Unit 2: Numbers')).toBeInTheDocument()
    expect(screen.getByText('Unit 3: Time expressions')).toBeInTheDocument()
  })

  it('renders correct number of units', () => {
    render(<Home />)

    // Check for the last unit to verify all are rendered
    expect(screen.getByText('Unit 78: Science')).toBeInTheDocument()
  })

  it('displays word counts for each unit', () => {
    render(<Home />)

    // Check word counts are displayed
    expect(screen.getByText('53/53 个单词')).toBeInTheDocument()
    expect(screen.getByText('55/55 个单词')).toBeInTheDocument()
  })
})
