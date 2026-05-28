import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule] 
})
export class StatusBadgeComponent  implements OnInit {

  @Input() dataCompra!: Date;
  @Input() duracaoGarantia!: number; // in months

  estado!: string;
  color!: string;

  ngOnInit(): void {
    this.calcularEstado();
  }

  private calcularEstado(): void {

    const hoje = new Date();
    const expiracao = new Date(this.dataCompra);
    expiracao.setMonth(expiracao.getMonth() + this.duracaoGarantia);

    const diasRestantes = Math.ceil((expiracao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    // milisegundos para dias arredondado para cima

    if (diasRestantes < 0) 
    {
      this.estado = 'EXPIRADO';
      this.color = 'danger';
    } 
    else if (diasRestantes <= 30) 
    {
      this.estado = 'A EXPIRAR';
      this.color = 'warning';
    } 
    else 
    {
      this.estado = 'VÁLIDO';
      this.color = 'success';
    }
  }
}