import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ElementumGame } from './app.component'

describe('ElementumGame', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ElementumGame
      ],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ElementumGame)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have as title 'client'`, () => {
    const fixture = TestBed.createComponent(ElementumGame)
    const app = fixture.componentInstance
    expect(app.title).toEqual('client')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(ElementumGame)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('.content span')?.textContent).toContain('client app is running!')
  })
})
