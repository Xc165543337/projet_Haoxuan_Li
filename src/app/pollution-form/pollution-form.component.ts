import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PollutionDeclaration, POLLUTION_TYPES, POLLUTION_LEVELS } from '../models/pollution.model'

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pollution-form.component.html',
  styleUrls: ['./pollution-form.component.less'],
})
export class PollutionFormComponent implements OnInit {
  @Input() pollution: PollutionDeclaration | null = null
  @Output() saveEvent = new EventEmitter<PollutionDeclaration>()
  @Output() cancelEvent = new EventEmitter<void>()

  niveaux = [...POLLUTION_LEVELS]
  types = [...POLLUTION_TYPES]
  isEditMode = false

  ngOnInit(): void {
    this.isEditMode = !!this.pollution?.id
  }

  onSubmit(): void {
    if (this.pollution) {
      this.saveEvent.emit(this.pollution)
    }
  }

  onCancel(): void {
    this.cancelEvent.emit()
  }

  isValidImageUrl(url: string | undefined): boolean {
    if (!url) return false
    return (
      url.trim().length > 0 &&
      (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/'))
    )
  }
}
