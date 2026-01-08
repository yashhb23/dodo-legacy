import { ArrowRight, MapPin, BookOpen, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getRelatedItems = (currentType, currentId, allData) => {
  // Logic to find related content based on type and id
  const related = [];
  
  // Get 3 random items from other categories
  const districts = allData.districts || [];
  const culture = allData.culture || [];
  const history = allData.history || [];
  
  // Filter out current item and shuffle
  const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
  
  if (currentType !== 'district' && districts.length > 0) {
    const shuffled = shuffle([...districts]);
    related.push({ ...shuffled[0], type: 'district', icon: MapPin });
  }
  
  if (currentType !== 'culture' && culture.length > 0) {
    const shuffled = shuffle([...culture]);
    related.push({ ...shuffled[0], type: 'culture', icon: Palette });
  }
  
  if (currentType !== 'history' && history.length > 0) {
    const shuffled = shuffle([...history]);
    related.push({ ...shuffled[0], type: 'history', icon: BookOpen });
  }
  
  return related.slice(0, 3);
};

export default function RelatedContent({ 
  currentType, 
  currentId, 
  districts = [], 
  culture = [], 
  history = [],
  onItemClick 
}) {
  const allData = { districts, culture, history };
  const relatedItems = getRelatedItems(currentType, currentId, allData);
  
  if (relatedItems.length === 0) return null;

  const typeLabels = {
    district: 'Explore District',
    culture: 'Discover Culture',
    history: 'Learn History'
  };

  return (
    <div className="mt-8 pt-6 border-t border-border/50">
      <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <ArrowRight className="w-4 h-4" />
        Continue Exploring
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {relatedItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onItemClick?.(item.type, item)}
              className="group p-3 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="text-xs mb-1">
                    {typeLabels[item.type]}
                  </Badge>
                  <h5 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {item.name || item.title}
                  </h5>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
