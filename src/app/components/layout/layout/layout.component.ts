import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from '../../../models/menu.interface';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, NgClass, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  isCollapsed: boolean = false;
  menuItems: MenuItem[];

  constructor() {
    this.menuItems = [
      {
        label: 'Configuración',
        icon: 'fa-solid fa-gears',
        order: 1,
        children: [
          {
            label: 'Sucursales',
            link: '/admin/branch-offices/list',
            order: 1,
          },
          {
            label: 'Tipo de servicio',
            link: '/admin/type-service/list',
            order: 2,
          },
          { label: 'Servicios', link: '/admin/services/list', order: 3 },
          { label: 'Proveedor', link: '/admin/provideer/list', order: 4 },
        ],
      },
      {
        label: 'Ventas',
        icon: 'fa-solid fa-chart-line',
        order: 2,
        children: [
          {
            label:'Reporte Diario',
            link:'/admin/sales/daily',
            order:1
          },
          {
            label: 'Cargar Archivos',
            link: '/admin/sales/upload',
            order: 2,
          },
          {
            label: 'Reporte',
            link: '/admin/sales/report',
            order: 3,
          },
        ],
      },
    ];
  }
  ngOnInit() {
    this.sortMenuItems(this.menuItems);
  }

  private sortMenuItems(items: MenuItem[]) {
    items.forEach((item) => {
      if (item.children) {
        // Ordenar los hijos de manera recursiva
        this.sortMenuItems(item.children);
      }
    });

    // Ordenar los elementos actuales por la propiedad 'order'
    items.sort((a, b) => a.order - b.order);
  }

  toggleSubmenu(menuItem: MenuItem) {
    if (menuItem.children && menuItem.children.length > 0) {
      menuItem.expanded = !menuItem.expanded;
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
