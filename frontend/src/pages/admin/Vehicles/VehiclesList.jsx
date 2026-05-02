
import { daysUntil } from '../../../utils/date';
import { MaintenanceBadge } from '../../../ui/badge';
import {List,Card,Left,Right,Plate,Meta,Btn} from '../../../styles/VehiclesList.styles';


export default function VehiclesList({ vehicles, onEdit, onDelete, onMaintenance, onAssignDriver }) {
	

  return (
    <List>
      {vehicles.map(v => {
        const nextMaintenance =
          v.vehicle_maintenances?.[0]?.next_maintenance_date;

        const days = daysUntil(nextMaintenance);

        return (
          <Card key={v.id}>
            <Left>
              <Plate>{v.plate}</Plate>
              <Meta>{v.brand} • {v.model}</Meta>
            </Left>

            <Right>
              {days !== null && days <= 30 && (
                <MaintenanceBadge $urgent={days <= 7}>
                  {days <= 0
                    ? 'Bakım Gecikti'
                    : `${days} gün sonra bakım`}
                </MaintenanceBadge>
              )}

				<Btn onClick={() => onMaintenance(v)}> 🔧 Bakımlar </Btn>
				<Btn onClick={() => onAssignDriver(v)}> 👤 Driver Ata </Btn>


				<Btn onClick={() => {
				  console.log('EDIT CLICK', v);
				  onEdit(v);
				  }}> Düzenle
				</Btn>
				<Btn $danger onClick={() => {
					console.log('DELETE CLICK', v.id);
					onDelete(v.id);}}> Sil 
				</Btn>

            </Right>
          </Card>
        );
      })}
    </List>
  );
}